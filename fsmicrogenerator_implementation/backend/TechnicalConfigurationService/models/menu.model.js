const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let menuSchema = new Schema(
  {
    etatDePublication: {
      type: String,
      required: true,
      enum: ["code_541", "code_223", "code_224", "code_11201", "code_3417"],
    },
    etatObjet: { type: String, default: "code-1" },
    translations: {
      type: [
        { language: { type: String }, titre: { type: String, required: true } },
      ],
    },
    planPrincipale: { type: Boolean, required: true },
    megaMenu: { type: Boolean, required: true },
    icon: { type: String },
    ordre: { type: Number, required: true },
    priorite: { type: Number, required: true },
    path: { type: String },
    typeAffichage: {
      type: String,
      enum: [
        "code_13884",
        "code_13883",
        "code_2021",
        "code_187",
        "code_13926",
        "code_13927",
        null,
      ],
    },
    showAll: { type: Boolean },
    nbrElement: { type: Number },
    typeSelect: {
      type: String,
      enum: [
        "code_13897",
        "code_13898",
        "code_13899",
        "code_13900",
        "code_13901",
        null,
      ],
    },
    typeActivation: {
      type: String,
      required: true,
      enum: ["code_1960", "code_1962", "code_1963"],
    },
    periodeActivation: {
      type: [{ dateDebut: { type: Date }, dateFin: { type: Date } }],
    },
    periodiciteActivation: { type: Object },
    elementAffiche: { type: [Schema.Types.ObjectId] },
    menuParent: { type: Schema.Types.ObjectId, ref: "menu" },
    menuAssocies: [{ type: Schema.Types.ObjectId, ref: "menu" }],
    menuPrincipal: { type: Boolean, required: true },
    actif: { type: Boolean, required: true },
    serviceConfig: {
      service: String,
      classe: String,
      option: Schema.Types.Mixed,
    },
    type: {
      type: String,
      required: true,
      enum: ["code_13934", "code_5041", "code_13994"],
    },
  },
  { timestamps: true }
);

const populateField = [
  { path: "menuAssocies", match: { etatObjet: "code-1" }, populate: [] },
];

menuSchema.pre(/find.*/, function (next) {
  try {
    this.populate(populateField);
    next();
  } catch (error) {
    next(error);
  }
});

menuSchema.pre("aggregate", function (next) {
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

menuSchema.post("save", async function (doc, next) {
  try {
    if (this.menuParent) {
      await menu.updateOne(
        { _id: this.menuParent.toString() },
        { $addToSet: { menuAssocies: this._id } }
      );
    }
    next();
  } catch (error) {
    next(error);
  }
});

menuSchema.post("insertMany", async function (doc, next) {
  try {
    this.populate(doc, populateField);
    let menuParent = GroupBy(doc, "menuParent");
    for (let item of Object.keys(menuParent)) {
      if (item)
        await menu.updateOne(
          { _id: item.toString() },
          {
            $addToSet: {
              menuAssocies: { $each: menuParent[item].map((d) => d._id) },
            },
          }
        );
    }
    next();
  } catch (error) {
    next(error);
  }
});

menuSchema.pre("findOneAndUpdate", async function (next) {
  try {
    let doc = await menu.findOne(this.getQuery()).lean();
    if (doc) {
      const menuParentId = this._update?.["$set"]?.menuParent;
      if (doc?.menuParent && doc?.menuParent != menuParentId) {
        await menu.updateOne(
          { _id: doc.menuParent },
          { $pull: { menuAssocies: doc._id } }
        );
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

menuSchema.post("findOneAndUpdate", async function (doc, next) {
  try {
    if (doc.menuParent) {
      await menu.updateOne(
        { _id: doc.menuParent },
        { $addToSet: { menuAssocies: doc._id } }
      );
    }
    next();
  } catch (error) {
    next(error);
  }
});

const menu = mongoose.model("menu", menuSchema);
module.exports = menu;

const { GroupBy } = require("../helpers/helpers");
