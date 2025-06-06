const mongoose = require("mongoose");
const transactionModel = require("./transaction.model");

const transactionLineSchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "transaction",
    required: false,
  },
  product: { type: mongoose.Schema.Types.ObjectId, required: true },
});

async function populateProducts(docs) {
  const isArray = Array.isArray(docs);
  const rabbit = await getRabbitInstance();

  const processDoc = async (doc) => {
    if (doc.product) {
      try {
        const productData = await rabbit.rpcRequest("product_rpc", {
          type: "GET_PRODUCT_BY_ID",
          id: doc.product.toString(),
        });
        if (productData) {
          doc.product = productData;
        } else {
          console.error(`No product data found for product ID: ${doc.product}`);
        }
      } catch (error) {
        console.error(
          `Failed to fetch product data for product ID: ${doc.product}`,
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

transactionLineSchema.post(/find.*|save/, async function (docs, next) {
  try {
    await populateProducts(docs);
    console.log("🚀 ~ docs:", docs);
    next();
  } catch (err) {
    console.error("Error in post middleware for find or save:", err);
    next(err);
  }
});

transactionLineSchema.post("insertMany", async function (docs, next) {
  try {
    if (docs && docs.length) {
      const transactionId = docs[0].transaction;
      const ligneIds = docs.map((doc) => doc._id);

      await transactionModel.updateMany(
        { _id: transactionId },
        { $push: { transactionLigne: { $each: ligneIds } } }
      );
    }
    next();
  } catch (err) {
    console.error("Error in post middleware for insertMany:", err);
    next(err);
  }
});

const TransactionLine = mongoose.model(
  "transactionLine",
  transactionLineSchema
);
module.exports = TransactionLine;
const getRabbitInstance = require("../middlewares/rabbitInstance");
