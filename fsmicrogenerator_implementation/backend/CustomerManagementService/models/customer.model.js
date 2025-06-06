const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let customerSchema = new Schema(
  {
    etatObjet: { type: String, default: "code-1" },
    photo: { type: String },
    translations: {
      type: [
        {
          language: { type: String },
          name: { type: String, required: true },
          address: { type: String },
        },
      ],
    },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    orders: [{ type: Schema.Types.ObjectId }],
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
            sendRPCRequest(doc, TRANSACTION_RPC, ["orders"], "VIEW_ITEMS", {
              queryOptions: {
                select: "-ligneTransactions -supplier -customer",
              },
            }),
          ]
      ).then((result) => {
        if (doc instanceof Array) {
        } else {
          if (doc["orders"] && doc["orders"].length)
            doc["orders"] = doc["orders"].map(
              (d) =>
                (d = result[0].find((item) => item._id === (d._id || d)) || d)
            );
        }
      });
  } catch (error) {
    throw new Error(error);
  }
}

customerSchema.post(/find.*|save/, async function (doc) {
  try {
    await distantRequest(doc);
  } catch (error) {
    logger.error(
      `error while getting distant data for model customer==>${error}`
    );
  }
});

customerSchema.pre("aggregate", function (next) {
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

const customer = mongoose.model("customer", customerSchema);
module.exports = customer;

const { sendRPCRequest } = require("../helpers/helpers");
const { TRANSACTION_RPC } = require("../config");
const logger = require("../middlewares/winston.middleware");
