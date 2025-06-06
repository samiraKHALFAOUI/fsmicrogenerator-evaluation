const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let langueSiteSchema = new Schema(
  {
    etatObjet: { type: String, default: "code-1" },
    code: { type: String, required: true, unique: true },
    translations: {
      type: [
        {
          language: { type: String },
          value: { type: String, required: true },
          commentaire: { type: String },
        },
      ],
    },
    flag: { type: String },
    actif: { type: Boolean, required: true },
    ordreAffichage: { type: Number, required: true },
    langueParDefault: { type: Boolean, required: true },
  },
  { timestamps: true }
);

async function setDefaultLangue(doc) {
  if (doc.langueParDefault && doc.actif)
    await langue.findOneAndUpdate(
      { _id: { $ne: doc._id.toString() }, langueParDefault: true },
      { $set: { langueParDefault: false } },
      { new: true }
    );
}

let prevDefaultValue = null;

langueSiteSchema.post("save", async function (doc, next) {
  try {
    await setDefaultLangue(doc);
  } catch (error) {
    next(error);
  }
});

langueSiteSchema.pre("findOneAndUpdate", async function (next) {
  try {
    let doc = await langue.findOne(this.getQuery()).lean();
    if (doc) {
      prevDefaultValue = doc?.langueParDefault;
    }
    next();
  } catch (error) {
    next(error);
  }
});
langueSiteSchema.post("findOneAndUpdate", async function (doc, next) {
  try {
    if (doc) {
      if (prevDefaultValue != doc.langueParDefault) await setDefaultLangue(doc);
    }
    next();
  } catch (error) {
    next(error);
  }
});

const langue = mongoose.model("langueSite", langueSiteSchema);
module.exports = langue;
