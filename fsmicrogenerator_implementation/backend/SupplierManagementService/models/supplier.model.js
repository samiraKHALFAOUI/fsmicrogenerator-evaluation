const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let supplierSchema = new Schema(
  {
    etatObjet: { type: String, default: "code-1" },
    logo: { type: String },
    translations: {
      type: [
        {
          language: { type: String },
          name: { type: String, required: true },
          address: { type: String, required: true },
        },
      ],
    },
    email: { type: String, required: true, unique: true },
    officePhoneNumber: { type: String, required: true, unique: true },
    isActif: { type: Boolean, default: "true" },
    purchases: [{ type: Schema.Types.ObjectId }],
    products: [{ type: Schema.Types.ObjectId }],
  },
  { timestamps: true }
);

async function distantRequest(doc) {
  try {
    if (doc)
      await Promise.all(
        doc instanceof Array
          ? []
          : [
            sendRPCRequest(doc, PRODUCT_RPC, ["products"], "VIEW_ITEMS", {
              queryOptions: {
                select: "-supplier -transactionLines -inventoryMovements",
              },
            }),
            sendRPCRequest(
              doc,
              TRANSACTION_RPC,
              ["purchases"],
              "VIEW_ITEMS",
              {
                queryOptions: {
                  select: "-supplier -customer -transactionLines",
                },
              }
            ),
          ]
      ).then((result) => {
        if (doc instanceof Array) {
        } else {
          if (doc["products"] && doc["products"].length)
            doc["products"] = doc["products"].map(
              (d) =>
                (d = result[0].find((item) => item._id === (d._id || d)) || d)
            );
          if (doc["purchases"] && doc["purchases"].length)
            doc["purchases"] = doc["purchases"].map(
              (d) =>
                (d = result[1].find((item) => item._id === (d._id || d)) || d)
            );
        }
      });
  } catch (error) {
    throw new Error(error);
  }
}

supplierSchema.post(/find.*|save/, async function (doc) {
  try {
    await distantRequest(doc);
  } catch (error) {
    logger.error(
      `error while getting distant data for model supplier==>${error}`
    );
  }
});

supplierSchema.pre("aggregate", function (next) {
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

const supplier = mongoose.model("supplier", supplierSchema);
module.exports = supplier;

const { sendRPCRequest } = require("../helpers/helpers");
const { PRODUCT_RPC, TRANSACTION_RPC } = require("../config");
const logger = require("../middlewares/winston.middleware");
