const mongoose = require("mongoose");
const getRabbitInstance = require("../middlewares/rabbitInstance");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    reference: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    salePrice: { type: Number, required: true },
    currency: { type: String, required: true },
    stockQuantity: { type: Number },
    unit: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "out_of_stock", "discontinued"],
      required: true,
    },
    category: { type: String, ref: "categorie", required: true },
    supplier: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

productSchema.post("save", async function (doc, next) {
  try {
    next();
  } catch (error) {
    console.log("🚀 ~ productSchema.post ~ error:", error);
    next(error);
  }
});

productSchema.post(/find.*/, async function (doc, next) {
  try {
    await popualteExeternalData(doc);
    console.log("🚀 ~ doc:", doc);
    next();
  } catch (err) {
    console.error("Error in post middleware for find or save:", err);
    next(err);
  }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

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
    // console.log("🚀 ~ processDoc ~ docObj:", docObj)
  };

  if (isArray) {
    docs = await Promise.all(docs.map(processDoc));
  } else {
    await processDoc(docs);
  }
}