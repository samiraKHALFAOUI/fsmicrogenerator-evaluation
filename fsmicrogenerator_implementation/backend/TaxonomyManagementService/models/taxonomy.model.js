const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let taxonomySchema = new Schema(
  {
    etatObjet: { type: String, default: "code-1" },
    logo: { type: String },
    translations: {
      type: [
        {
          language: { type: String },
          designation: { type: String, required: true },
          description: { type: String },
        },
      ],
    },
    domain: { type: Schema.Types.ObjectId, ref: "domain" },
    parent: { type: Schema.Types.ObjectId, ref: "taxonomy" },
    children: [{ type: Schema.Types.ObjectId, ref: "taxonomy" }],
  },
  { timestamps: true }
);

const populateField = [{ path: "children", match: { etatObjet: "code-1" } }];
taxonomySchema.pre(/find.*/, function (next) {
  try {
    this.populate(populateField);
    next();
  } catch (error) {
    next(error);
  }
});

taxonomySchema.post("save", async function (doc, next) {
  try {
    if (this.domain) {
      await Domain.updateOne(
        { _id: this.domain.toString() },
        { $addToSet: { taxonomies: this._id } }
      );
    }
    if (this.parent) {
      await taxonomy.updateOne(
        { _id: this.parent.toString() },
        { $addToSet: { children: this._id } }
      );
    }

    next();
  } catch (error) {
    next(error);
  }
});

taxonomySchema.post("insertMany", async function (doc, next) {
  try {
    let domain = GroupBy(doc, "domain");
    for (let item of Object.keys(domain))
      if (item) {
        await Domain.updateOne(
          { _id: item.toString() },
          {
            $addToSet: {
              taxonomies: { $each: domain[item].map((d) => d._id) },
            },
          }
        );
      }
    let parent = GroupBy(doc, "parent");
    for (let item of Object.keys(parent))
      if (item) {
        await taxonomy.updateOne(
          { _id: item.toString() },
          { $addToSet: { children: { $each: parent[item].map((d) => d._id) } } }
        );
      }
    next();
  } catch (error) {
    next(error);
  }
});

taxonomySchema.pre("findOneAndUpdate", async function (next) {
  try {
    let doc = await taxonomy.findOne(this.getQuery()).lean();

    const domainId = this._update?.["$set"]?.domain;
    if (domainId && doc?.domain != domainId && doc?.domain != undefined) {
      await Domain.updateOne(
        { _id: doc.domain.toString() },
        { $pull: { taxonomies: doc._id } }
      );
    }
    next();
  } catch (error) {
    next(error);
  }
});

taxonomySchema.post("findOneAndUpdate", async function (doc, next) {
  try {
    if (doc.domain) {
      await Domain.updateOne(
        { _id: doc.domain?._id?.toString() || doc.domain },
        { $addToSet: { taxonomies: doc._id } }
      );
    }
    next();
  } catch (error) {
    next(error);
  }
});

const taxonomy = mongoose.model("taxonomy", taxonomySchema);
module.exports = taxonomy;

const { GroupBy } = require("../helpers/helpers");
const Domain = require("./domain.model");
