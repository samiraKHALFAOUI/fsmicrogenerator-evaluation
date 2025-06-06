const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true },
    type: { type: String, enum: ["purchase", "sale"], required: true },
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shiped",
        "delivred",
        "cancelled",
        "returned",
      ],
    },
    savedBy: { type: String },
    transactionLigne: [
      { type: mongoose.Schema.Types.ObjectId, ref: "transactionLine" },
    ],
    supplier: { type: mongoose.Schema.Types.ObjectId, required: false },
    costumer: { type: mongoose.Schema.Types.ObjectId, required: false },
  },
  {
    timestamps: true,
  }
);
transactionSchema.post("save", async function (doc, next) {
  this.populate([
    {
      path: "transactionLigne",
    },
  ]);
  // if (Array.isArray(doc.transactionLigne) && doc.transactionLigne.length > 0) {
  //   await TransactionLine.updateMany(
  //     {
  //       _id: { $in: doc.transactionLigne.map((item) => item._id || item) },
  //     },
  //     {
  //       $set: {
  //         transaction: doc._id,
  //       },
  //     }
  //   );
  // }
});

transactionSchema.pre(/find.*/, function (next) {
  try {
    this.populate([
      {
        path: "transactionLigne",
      },
    ]);
    next();
  } catch (error) {
    next(error);
  }
});

transactionSchema.post(/find.*/, async function (doc, next) {
  try {
    await popualteExeternalData(doc);
    console.log("🚀 ~ doc:", doc);
    next();
  } catch (err) {
    console.error("Error in post middleware for find or save:", err);
    next(err);
  }
});

let prevStatus;
transactionSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const doc = await Transaction.findOne(this.getQuery()).lean();
    prevStatus = doc.status;
    next();
  } catch (error) {
    next(error);
  }
});
transactionSchema.post("findOneAndUpdate", async function (doc, next) {
  try {
    if (
      doc &&
      prevStatus != doc.status &&
      !(doc.status == "cancelled" && prevStatus != "pending")
    ) {
      await generateInventoryMovement(doc);
    }
    next();
  } catch (error) {
    next(error);
  }
});

async function generateInventoryMovement(doc) {
  const movements = [];
  for (let line of doc.transactionLigne) {
    let movementType;
    let movementRaison;

    if (doc.type === "sale") {
      /**sale */
      switch (doc.status) {
        case "processing":
          movementType = "EXIT"; /** EXIT */
          movementRaison = "Stock reserved";
          break;
        case "shiped":
          movementType = "EXIT";
          movementRaison = "Stock shipped";
          break;
        case "returned":
          movementType = "ENTRY";
          movementRaison = "Stock returned";
          break;
        case "code_18439":
          movementType = "ENTRY";
          movementRaison = "Stock returned";
          break;
        default:
          return;
      }
    } else if (doc.type === "purchase") {
      /**purchase */
      switch (doc.status) {
        case "delivred":
          movementType = "ENTRY"; /** ENTRY */
          movementRaison = "Purchased items received";
          break;
        case "returned":
          movementType = "EXIT"; /** EXIT */
          movementRaison = "Items returned to supplier";
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
      purchasePrice: line.price,
      product: line.product._id || line.product,
      transactionLine: line._id,
    });
  }
  if (movements.length) {
    const rabbit = await getRabbitInstance();
    console.log("🚀 ~ generateInventoryMovement ~ movements:", movements);
    rabbit.publish("inventory_movement_key", movements);
  }
}
const Transaction = mongoose.model("transaction", transactionSchema);
module.exports = Transaction;
const getRabbitInstance = require("../middlewares/rabbitInstance");

async function popualteExeternalData(docs) {
  const isArray = Array.isArray(docs);
  const rabbit = await getRabbitInstance();

  const processDoc = async (doc) => {
    if (doc.supplier) {
      try {
        const supplierData = await rabbit.rpcRequest("supplier_rpc", {
          type: "GET_SUPPLIER_BY_ID",
          id: doc.supplier.toString(),
        });
        if (supplierData) {
          doc.supplier = supplierData;
        } else {
          console.error(
            `No Supllier data found for supplier ID: ${doc.supplier}`
          );
        }
      } catch (error) {
        console.error(
          `Failed to fetch supplier data for supplier ID: ${doc.supplier}`,
          error
        );
      }
    }
    if (doc.customer) {
      try {
        const customerData = await rabbit.rpcRequest("customer_rpc", {
          type: "GET_CUSTOMER_BY_ID",
          id: doc.customer.toString(),
        });
        if (customerData) {
          doc.supplier = customerData;
        } else {
          console.error(
            `No customer data found for customer ID: ${doc.customer}`
          );
        }
      } catch (error) {
        console.error(
          `Failed to fetch customer data for customer ID: ${doc.customer}`,
          error
        );
      }
    }

    // console.log("🚀 ~ processDoc ~ docObj:", docObj)
  };

  if (isArray) {
    docs = await Promise.all(docs.map(processDoc));
  } else {
    await processDoc(docs);
  }
}
