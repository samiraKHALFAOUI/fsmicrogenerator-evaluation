const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let transactionLineSchema = new Schema(
  {
    etatObjet: { type: String, default: "code-1" },
    product: { type: Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    currency: { type: Schema.Types.ObjectId, required: true },
    transaction: {
      type: Schema.Types.ObjectId,
      ref: "transaction",
      required: true,
    },
    inventoryMovement: [{ type: Schema.Types.ObjectId }],
  },
  { timestamps: true }
);

async function distantRequest(doc) {
  try {
    if (doc)
      await Promise.all(
        doc instanceof Array
          ? [
            sendRPCRequest(doc, PRODUCT_RPC, ["product"], "VIEW_ITEMS", {
              queryOptions: {
                select: "-supplier -transactionLines -inventoryMovements",
              },
            }),
            sendRPCRequest(doc, CURRENCY_RPC, ["currency"], "VIEW_ITEMS", {
              queryOptions: { select: "-exchangeRates" },
            }),
          ]
          : [
            sendRPCRequest(doc, PRODUCT_RPC, ["product"], "VIEW_ITEM", {
              queryOptions: {
                select: "-supplier -transactionLines -inventoryMovements",
              },
            }),
            sendRPCRequest(doc, CURRENCY_RPC, ["currency"], "VIEW_ITEM", {
              queryOptions: { select: "-exchangeRates" },
            }),
          ]
      ).then((result) => {
        if (doc instanceof Array) {
          doc.map((d) => {
            if (d["product"])
              d["product"] =
                result[0].find(
                  (item) => item._id === (d["product"]?._id || d["product"])
                ) || d["product"];
            if (d["currency"])
              d["currency"] =
                result[1].find(
                  (item) => item._id === (d["currency"]?._id || d["currency"])
                ) || d["currency"];
          });
        } else {
          if (doc["product"]) doc["product"] = result[0] || doc["product"];
          if (doc["currency"]) doc["currency"] = result[1] || doc["currency"];
        }
      });
  } catch (error) {
    throw new Error(error);
  }
}

transactionLineSchema.post(/find.*|save/, async function (doc) {
  try {
    await distantRequest(doc);
  } catch (error) {
    logger.error(
      `error while getting distant data for model transactionLine==>${error}`
    );
  }
});

transactionLineSchema.pre("aggregate", function (next) {
  try {
    const pipeline = this.pipeline();
    let index = pipeline.findIndex((p) => p["$match"]);
    if (index === -1) {
      pipeline.unshift({ $match: { etatObjet: "code-1" } });
    } else {
      if (!pipeline[index]["$match"]["etatObjet"]) {
        pipeline[index]["$match"]["etatObjet"] = "code-1";
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

transactionLineSchema.post("save", async function (doc, next) {
  try {
    if (this.transaction) {
      await Transaction.updateOne(
        { _id: this.transaction.toString() },
        { $addToSet: { transactionLines: this._id } }
      );
    }
    if (doc.product)
      publishUpdate("update_items", doc.product, PRODUCT_QUEUE, {
        operation: "$addToSet",
        body: { transactionLines: doc._id },
      });
    next();
  } catch (error) {
    next(error);
  }
});

transactionLineSchema.post("insertMany", async function (doc, next) {
  try {
    let transaction = GroupBy(doc, "transaction");
    for (let item of Object.keys(transaction))
      if (item) {
        await Transaction.updateOne(
          { _id: item.toString() },
          {
            $addToSet: {
              transactionLines: { $each: transaction[item].map((d) => d._id) },
            },
          }
        );
      }

    let product = GroupBy(doc, "product");
    for (let item of Object.keys(product)) {
      if (item)
        publishUpdate(
          "update_items",
          [...new Set(flatDeep(product[item].map((d) => d.product)))],
          PRODUCT_QUEUE,
          {
            operation: "$addToSet",
            body: {
              transactionLines: { $each: product[item].map((i) => i._id) },
            },
          }
        );
    }

    next();
  } catch (error) {
    next(error);
  }
});

const transactionLine = mongoose.model(
  "transactionLine",
  transactionLineSchema
);
module.exports = transactionLine;

const Transaction = require("../models/transaction.model");
const {
  GroupBy,
  publishUpdate,
  sendRPCRequest,
  flatDeep,
} = require("../helpers/helpers");
const { PRODUCT_RPC, CURRENCY_RPC, PRODUCT_QUEUE } = require("../config");
const logger = require("../middlewares/winston.middleware");
