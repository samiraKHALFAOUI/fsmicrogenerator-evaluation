const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let inventorySchema = new Schema(
  {
    etatObjet: { type: String, default: "code-1" },
    product: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, required: true, enum: ["code_18416", "code_18417"] },
    raison: { type: String, required: true },
    date: { type: Date, required: true },
    quantity: { type: Number },
    price: { type: Number, required: true },
    transactionLine: { type: Schema.Types.ObjectId, required: true },
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
            sendRPCRequest(
              doc,
              TRANSACTIONLINE_RPC,
              ["transactionLine"],
              "VIEW_ITEMS",
              { queryOptions: { select: "currency" } }
            ),
          ]
          : [
            sendRPCRequest(doc, PRODUCT_RPC, ["product"], "VIEW_ITEM", {
              queryOptions: {
                select: "-supplier -transactionLines -inventoryMovements",
              },
            }),
            sendRPCRequest(
              doc,
              TRANSACTIONLINE_RPC,
              ["transactionLine"],
              "VIEW_ITEM",
              { queryOptions: { select: "currency" } }
            ),
          ]
      ).then((result) => {
        if (doc instanceof Array) {
          doc.map((d) => {
            if (d["product"])
              d["product"] =
                result[0].find(
                  (item) => item._id === (d["product"]?._id || d["product"])
                ) || d["product"];
            if (d["transactionLine"])
              d["transactionLine"] =
                result[1].find(
                  (item) =>
                    item._id ==
                    (d["transactionLine"]?._id || d["transactionLine"])
                ) || d["transactionLine"];
          });
        } else {
          if (doc["product"]) doc["product"] = result[0] || doc["product"];
          if (doc["transactionLine"])
            doc["transactionLine"] = result[1] || doc["transactionLine"];
        }
      });
  } catch (error) {
    throw new Error(error);
  }
}

inventorySchema.post(/find.*|save/, async function (doc) {
  try {
    await distantRequest(doc);
  } catch (error) {
    logger.error(
      `error while getting distant data for model inventory==>${error}`
    );
  }
});

inventorySchema.pre("aggregate", function (next) {
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

inventorySchema.post("save", async function (doc, next) {
  try {
    if (doc.product)
      publishUpdate("update_items", doc.product, PRODUCT_QUEUE, {
        operation: "$addToSet",
        body: { inventoryMovements: doc._id },
      });
    if (doc.transactionLine)
      publishUpdate(
        "update_items",
        [doc.transactionLine],
        TRANSACTIONLINE_QUEUE,
        { operation: "$addToSet", body: { inventoryMovement: doc._id } }
      );
    next();
  } catch (error) {
    next(error);
  }
});

inventorySchema.post("insertMany", async function (doc, next) {
  try {
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
              inventoryMovements: { $each: product[item].map((i) => i._id) },
            },
          }
        );
    }

    let transactionLines = GroupBy(doc, "transactionLines");
    for (let item of Object.keys(transactionLines)) {
      if (item)
        publishUpdate(
          "update_items",
          [
            ...new Set(
              flatDeep(transactionLines[item].map((d) => d.transactionLines))
            ),
          ],
          TRANSACTIONLINE_QUEUE,
          {
            operation: "$addToSet",
            body: {
              inventoryMovement: {
                $each: transactionLines[item].map((i) => i._id),
              },
            },
          }
        );
    }

    next();
  } catch (error) {
    next(error);
  }
});

const inventory = mongoose.model("inventory", inventorySchema);
module.exports = inventory;

const {
  publishUpdate,
  sendRPCRequest,
  GroupBy,
  flatDeep,
} = require("../helpers/helpers");
const {
  PRODUCT_QUEUE,
  PRODUCT_RPC,
  TRANSACTIONLINE_QUEUE,
  TRANSACTIONLINE_RPC,
} = require("../config");
const logger = require("../middlewares/winston.middleware");
