const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let domainSchema = new Schema(
  {
    etatObjet: { type: String, default: "code-1" },
    code: { type: String, required: true, unique: true },
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
    hasTaxonomies: { type: Boolean },
    parent: { type: Schema.Types.ObjectId, ref: "domain" },
    children: [{ type: Schema.Types.ObjectId, ref: "domain" }],
    taxonomies: [{ type: Schema.Types.ObjectId, ref: "taxonomy" }],
  },
  { timestamps: true }
);

//  autoPopulate hook

const populateField = [
  { path: "children", match: { etatObjet: "code-1" }, populate: [] },
  { path: "taxonomies", match: { etatObjet: "code-1" }, populate: [] },
];
domainSchema.pre(/find.*/, function (next) {
  try {
    this.populate(populateField);
    next();
  } catch (error) {
    next(error);
  }
});

domainSchema.post("save", async function (doc, next) {
  try {
    if (this.parent) {
      await domain.updateOne(
        { _id: this.parent.toString() },
        { $addToSet: { children: this._id } }
      );
    }
    next();
  } catch (error) {
    next(error);
  }
});

domainSchema.post("insertMany", async function (doc, next) {
  try {
    let parent = GroupBy(doc, "parent");
    for (let item of Object.keys(parent))
      if (item) {
        await domain.updateOne(
          { _id: item.toString() },
          { $addToSet: { children: { $each: parent[item].map((d) => d._id) } } }
        );
      }
    next();
  } catch (error) {
    next(error);
  }
});

const domain = mongoose.model("domain", domainSchema);
module.exports = domain;

const { GroupBy } = require("../helpers/helpers");
