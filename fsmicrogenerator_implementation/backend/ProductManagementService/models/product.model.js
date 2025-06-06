const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let productSchema = new Schema(
  {
    etatObjet: { type: String, default: "code-1" },
    reference: { type: String, required: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: "category" },
    image: { type: String },
    translations: {
      type: [
        {
          language: { type: String },
          name: { type: String, required: true },
          description: { type: String },
        },
      ],
    },
    salePrice: { type: Number },
    currency: { type: Schema.Types.ObjectId },
    stockQuantity: { type: Number },
    unit: { type: Schema.Types.ObjectId },
    status: {
      type: String,
      required: true,
      enum: ["code_18398", "code_18399", "code_18400"],
    },
    supplier: { type: Schema.Types.ObjectId, required: true },
    transactionLines: [{ type: Schema.Types.ObjectId }],
    inventoryMovements: [{ type: Schema.Types.ObjectId }],
  },
  { timestamps: true }
);


productSchema.pre("aggregate", function (next) {
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

async function distantRequest(doc) {
  try {
    if (doc)
      await Promise.all(
        doc instanceof Array
          ? [
            sendRPCRequest(doc, TAXONOMY_RPC, ["unit"], "VIEW_ITEMS", { queryOptions: { select: '-children -parent -domain' } }),
            sendRPCRequest(doc, CURRENCY_RPC, ["currency"], "VIEW_ITEMS", { queryOptions: { select: '-exchangeRates' } }),
            sendRPCRequest(doc, SUPPLIER_RPC, ["supplier"], "VIEW_ITEMS", { queryOptions: { select: '-products' } }),
          ]
          : [
            sendRPCRequest(doc, TAXONOMY_RPC, ["unit"], "VIEW_ITEM", { queryOptions: { select: '-children -parent -domain' } }),
            sendRPCRequest(doc, CURRENCY_RPC, ["currency"], "VIEW_ITEM", { queryOptions: { select: '-exchangeRates' } }),
            sendRPCRequest(doc, SUPPLIER_RPC, ["supplier"], "VIEW_ITEM", { queryOptions: { select: '-products' } }),
            sendRPCRequest(
              doc,
              INVENTORY_RPC,
              ["inventoryMovements"],
              "VIEW_ITEMS",
              {}
            ),
          ]
      ).then((result) => {
        if (doc instanceof Array) {
          doc.map((d) => {
            if (d["unit"])
              d["unit"] =
                result[0].find(
                  (item) => item._id === (d["unit"]?._id || d["unit"])
                ) || d["unit"];
            if (d["currency"])
              d["currency"] =
                result[1].find(
                  (item) => item._id === (d["currency"]?._id || d["currency"])
                ) || d["currency"];
            if (d["supplier"])
              d["supplier"] =
                result[2].find(
                  (item) => item._id === (d["supplier"]?._id || d["supplier"])
                ) || d["supplier"];
          });
        } else {
          if (doc["unit"]) doc["unit"] = result[0] || doc["unit"];
          if (doc["currency"]) doc["currency"] = result[1] || doc["currency"];
          if (doc["supplier"]) doc["supplier"] = result[2] || doc["supplier"];
          if (doc["inventoryMovements"] && doc["inventoryMovements"].length)
            doc["inventoryMovements"] = doc["inventoryMovements"].map(
              (d) =>
                (d = result[3].find((item) => item._id === (d._id || d)) || d)
            );
        }
      });
  } catch (error) {
    throw new Error(error);
  }
}

productSchema.post(/find.*|save/, async function (doc, next) {
  try {
    await distantRequest(doc);
    next();
  } catch (err) {
    next(err);
  }
});

productSchema.post(/find.*/, async function (doc, next) {
  if (doc && doc instanceof Array) {
    for (let i = 0; i < doc.length; i++) {
      await handleProductStatus(doc[i]);
    }
  }
  else {
    await handleProductStatus(doc);
  }
  next();
})

productSchema.post("save", async function (doc, next) {
  try {
    if (this.category) {
      await Category.updateOne(
        { _id: this.category.toString() },
        { $addToSet: { products: this._id } }
      );
    }
    if (this.supplier)
      publishUpdate("update_items", this.supplier, SUPPLIER_QUEUE, {
        operation: "$addToSet",
        body: { products: this._id },
      });
    next();
  } catch (error) {
    next(error);
  }
});

productSchema.post("insertMany", async function (doc, next) {
  try {
    await distantRequest(doc);

    let category = GroupBy(doc, "category");
    for (let item of Object.keys(category))
      if (item) {
        await Category.updateOne(
          { _id: item.toString() },
          {
            $addToSet: {
              products: { $each: category[item].map((d) => d._id) },
            },
          }
        );
      }

    let supplier = GroupBy(doc, "supplier");
    for (let item of Object.keys(supplier)) {
      if (item)
        publishUpdate(
          "update_items",
          [...new Set(flatDeep(supplier[item].map((d) => d.supplier)))],
          SUPPLIER_QUEUE,
          {
            operation: "$addToSet",
            body: { products: { $each: supplier[item].map((i) => i._id) } },
          }
        );
    }

    next();
  } catch (error) {
    next(error);
  }
});

let oldCategoryId = null;
productSchema.pre("findOneAndUpdate", async function (next) {
  try {
    let doc = await product.findOne(this.getQuery()).lean();
    oldCategoryId = null;
    if (doc) {
      const categoryId = this._update?.["$set"]?.category;
      oldCategoryId = (doc.category?._id || doc.category)?.toString();
      if (
        categoryId &&
        oldCategoryId != categoryId &&
        oldCategoryId != undefined
      ) {
        await Category.updateOne(
          { _id: oldCategoryId },
          { $pull: { products: doc._id } }
        );
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

productSchema.post("findOneAndUpdate", async function (doc, next) {
  try {
    if (doc && doc.category && doc.category._id.toString() != oldCategoryId) {
      await Category.updateOne(
        { _id: doc.category?._id?.toString() || doc.category },
        { $addToSet: { products: doc._id } }
      );
    }
    next();
  } catch (error) {
    next(error);
  }
});

async function handleProductStatus(doc) {
  var newStatus = null
  if (doc && doc.status) {
    if (doc.stockQuantity > 0 && doc.status != "code_18398") { /** disponible */
      newStatus = "code_18398";
    } else if (doc.status == "code_18398") {
      newStatus = "code_18399"; /**en rupture de stock */
    }
    if (newStatus) {
      await product.updateOne(
        { _id: doc._id },
        { $set: { status: newStatus } }
      )
      doc.status = newStatus
    }
  }
}

const product = mongoose.model("product", productSchema);
module.exports = product;

const Category = require("../models/category.model");

const {
  publishUpdate,
  sendRPCRequest,
  GroupBy,
  flatDeep,
} = require("../helpers/helpers");
const {
  SUPPLIER_QUEUE,
  TAXONOMY_RPC,
  INVENTORY_RPC,
  SUPPLIER_RPC,
  CURRENCY_RPC,
} = require("../config");
