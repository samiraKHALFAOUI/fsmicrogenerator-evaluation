const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let categorySchema = new Schema(
  {
    etatObjet: { type: String, default: "code-1" },
    icon: { type: String, default: null },
    translations: {
      type: [
        { language: { type: String }, name: { type: String, required: true } },
      ],
    },
    products: [{ type: Schema.Types.ObjectId, ref: "product" }],
    parentCategory: { type: Schema.Types.ObjectId, ref: "category" },
    subCategories: [{ type: Schema.Types.ObjectId, ref: "category" }],
  },
  { timestamps: true }
);

const populateField = [
  {
    path: "products",
    match: { etatObjet: "code-1" },
    populate: [],
    select: "-category",
  },
  {
    path: "subCategories",
    match: { etatObjet: "code-1" },
    populate: [],
    select: "-products",
  },
];

categorySchema.pre(/find.*/, function (next) {
  try {
    this.populate(populateField);
    next();
  } catch (error) {
    next(error);
  }
});

categorySchema.pre("aggregate", function (next) {
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

categorySchema.post("save", async function (doc, next) {
  try {
    if (this.parentCategory) {
      await category.updateOne(
        { _id: this.parentCategory.toString() },
        { $addToSet: { subCategories: this._id } }
      );
    }
    next();
  } catch (error) {
    next(error);
  }
});

categorySchema.post("insertMany", async function (doc, next) {
  try {
    let parentCategory = GroupBy(doc, "parentCategory");
    for (let item of Object.keys(parentCategory))
      if (item) {
        await category.updateOne(
          { _id: item.toString() },
          {
            $addToSet: {
              subCategories: { $each: parentCategory[item].map((d) => d._id) },
            },
          }
        );
      }
    next();
  } catch (error) {
    next(error);
  }
});

let oldParentCategoryId = null;
categorySchema.pre("findOneAndUpdate", async function (next) {
  try {
    let doc = await category.findOne(this.getQuery()).lean();
    oldParentCategoryId = null;
    if (doc) {
      const parentCategoryId = this._update?.["$set"]?.parentCategory;
      oldParentCategoryId = (
        doc.parentCategory?._id || doc.parentCategory
      )?.toString();
      if (
        oldParentCategoryId != parentCategoryId &&
        oldParentCategoryId != undefined
      ) {
        await category.updateOne(
          { _id: oldParentCategoryId },
          { $pull: { subCategories: doc._id } }
        );
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

categorySchema.post("findOneAndUpdate", async function (doc, next) {
  try {
    if (
      doc &&
      doc.parentCategory &&
      doc.parentCategory._id.toString() != oldParentCategoryId
    ) {
      await category.updateOne(
        { _id: doc.parentCategory._id.toString() },
        { $addToSet: { subCategories: doc._id } }
      );
    }
    next();
  } catch (error) {
    next(error);
  }
});

categorySchema.post("updateMany", async function (doc, next) {
  try {
    if (this._update["$set"] && this._update["$set"].parentCategory) {
      await category.updateOne(
        { _id: this._update["$set"].parentCategory },
        {
          $addToSet: {
            subCategories: { $each: this.getQuery()["_id"]["$in"] },
          },
        }
      );
    }
    next();
  } catch (error) {
    next(error);
  }
});

const category = mongoose.model("category", categorySchema);
module.exports = category;

const { GroupBy } = require("../helpers/helpers");
