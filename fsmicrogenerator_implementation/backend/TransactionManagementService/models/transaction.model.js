const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let transactionSchema = new Schema(
  {
    etatObjet: { type: String, default: "code-1" },
    reference: { type: String, required: true, unique: true },
    type: { type: String, required: true, enum: ["code_18440", "code_18441"] },
    registrationDate: { type: Date, required: true },
    status: {
      type: String,
      required: true,
      enum: [
        "code_1166",
        "code_1167",
        "code_18436",
        "code_18437",
        "code_18438",
        "code_18439",
      ],
    },
    savedBy: { type: Schema.Types.ObjectId, required: true },
    transactionLines: [{ type: Schema.Types.ObjectId, ref: "transactionLine" }],
    supplier: { type: Schema.Types.ObjectId },
    customer: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

const populateField = [
  { path: "transactionLines", match: { etatObjet: "code-1" }, populate: [] },
];

transactionSchema.pre(/find.*/, function (next) {
  try {
    this.populate(populateField);
    next();
  } catch (error) {
    next(error);
  }
});

async function distantRequest(doc) {
  try {
    if (doc)
      await Promise.all(
        doc instanceof Array
          ? [
            sendRPCRequest(doc, USER_RPC, ["savedBy"], "VIEW_ITEMS", {
              queryOptions: { select: "translations photo -groupe" },
            }),
            sendRPCRequest(doc, SUPPLIER_RPC, ["supplier"], "VIEW_ITEMS", {
              queryOptions: { select: "translations logo" },
            }),
            sendRPCRequest(doc, CUSTOMER_RPC, ["customer"], "VIEW_ITEMS", {
              queryOptions: { select: "translations photo" },
            }),
          ]
          : [
            sendRPCRequest(doc, USER_RPC, ["savedBy"], "VIEW_ITEM", {
              queryOptions: { select: "translations photo -groupe" },
            }),
            sendRPCRequest(doc, SUPPLIER_RPC, ["supplier"], "VIEW_ITEM", {
              queryOptions: { select: "translations products logo" },
            }),
            sendRPCRequest(doc, CUSTOMER_RPC, ["customer"], "VIEW_ITEM", {
              queryOptions: { select: "translations photo" },
            }),
          ]
      ).then((result) => {
        if (doc instanceof Array) {
          doc.map((d) => {
            if (d["savedBy"])
              d["savedBy"] =
                result[0].find(
                  (item) => item._id === (d["savedBy"]?._id || d["savedBy"])
                ) || d["savedBy"];
            if (d["supplier"])
              d["supplier"] =
                result[1].find(
                  (item) => item._id === (d["supplier"]?._id || d["supplier"])
                ) || d["supplier"];
            if (d["customer"])
              d["customer"] =
                result[2].find(
                  (item) => item._id === (d["customer"]?._id || d["customer"])
                ) || d["customer"];
          });
        } else {
          if (doc["savedBy"]) doc["savedBy"] = result[0] || doc["savedBy"];
          if (doc["supplier"]) doc["supplier"] = result[1] || doc["supplier"];
          if (doc["customer"]) doc["customer"] = result[2] || doc["customer"];
        }
      });
  } catch (error) {
    throw new Error(error);
  }
}

transactionSchema.post(/find.*|save/, async function (doc) {
  try {
    await distantRequest(doc);
  } catch (error) {
    logger.error(
      `error while getting distant data for model transaction==>${error}`
    );
  }
});

transactionSchema.pre("aggregate", function (next) {
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

transactionSchema.post("save", async function (doc, next) {
  try {
    if (doc.supplier)
      publishUpdate("update_items", doc.supplier, SUPPLIER_QUEUE, {
        operation: "$addToSet",
        body: { purchases: doc._id },
      });
    else if (doc.customer)
      publishUpdate("update_items", doc.customer, CUSTOMER_QUEUE, {
        operation: "$addToSet",
        body: { orders: doc._id },
      });

    next();
  } catch (error) {
    next(error);
  }
});

let prevStatus;
transactionSchema.pre("findOneAndUpdate", async function (next) {
  try {
    let doc = await transaction.findOne(this.getQuery()).lean();
    prevStatus = doc.status;
    next();
  } catch (error) {
    next(error);
  }
});

function generateInventoryMovement(doc) {
  const movements = [];
  for (let line of doc.transactionLines) {
    let movementType;
    let movementRaison;

    if (doc.type === "code_18440") {
      /**sale */
      switch (doc.status) {
        case "code_1167" /*PROCESSING*/:
          movementType = "code_18417"; /** EXIT */
          movementRaison = "code_18482";
          break;
        case "code_18436" /*SHIPPED*/:
          movementType = "code_18417";
          movementRaison = "code_18483";
          break;
        case "code_18439" /*RETURNED*/:
          movementType = "code_18416"; /** ENTRY */
          movementRaison = "code_18484";
          break;
        case "code_18438" /*CANCELLED*/:
          movementType = "code_18416"; /** ENTRY */
          movementRaison = "code_18485";
          break;
        default:
          return;
      }
    } else if (doc.type === "code_18441") {
      /**purchase */
      switch (doc.status) {
        case "code_18437" /*DELIVERED*/:
          movementType = "code_18416"; /** ENTRY */
          movementRaison = "code_18486";
          break;
        case "code_18439" /*RETURNED*/:
          movementType = "code_18417"; /** EXIT */
          movementRaison = "code_18487";
          break;
        default:
          return;
      }
    }

    movements.push({
      type: movementType,
      raison: movementRaison,
      date: new Date(),
      quantity: line.quantity,
      price: line.price,
      product: line.product._id || line.product,
      transactionLine: line._id,
    });
  }
  if (movements.length) {
    publishUpdate("add_items", movements, INVENTORY_QUEUE);
  }
}

transactionSchema.post("findOneAndUpdate", async function (doc, next) {
  try {
    if (
      doc &&
      prevStatus != doc.status &&
      !(doc.status === "code_18438" && prevStatus != "code_1167")
    ) {
      generateInventoryMovement(doc);
    }

    next();
  } catch (error) {
    next(error);
  }
});

const transaction = mongoose.model("transaction", transactionSchema);
module.exports = transaction;

const { publishUpdate, sendRPCRequest } = require("../helpers/helpers");
const {
  CUSTOMER_QUEUE,
  SUPPLIER_QUEUE,
  INVENTORY_QUEUE,
  SUPPLIER_RPC,
  CUSTOMER_RPC,
  USER_RPC,
} = require("../config");
const logger = require("../middlewares/winston.middleware");
