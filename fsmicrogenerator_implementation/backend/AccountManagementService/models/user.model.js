const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let userSchema = new Schema(
  {
    reference: { type: String, required: true, unique: true },
    pseudo: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    pwCrypte: { type: String, required: true },
    salutation: {
      type: String,
      required: true,
      enum: ["code_1232", "code_1233"],
    },
    translations: {
      type: [
        {
          language: { type: String },
          nom: { type: String, required: true },
          prenom: { type: String, required: true },
        },
      ],
    },
    fonction: { type: Schema.Types.ObjectId, required: true },
    photo: { type: String },
    telephone: { type: String, required: true },
    fixe: { type: String },
    nbreConnection: { type: Number },
    dateDerniereConnexion: { type: Date },
    etatCompte: {
      type: String,
      required: true,
      enum: ["code_10577", "code_4316", "code_4317", "code_226"],
    },
    etatObjet: { type: String, default: "code-1" },
    groupe: { type: Schema.Types.ObjectId, ref: "group", required: true },
    historiqueConnexion: [Object],
  },
  { timestamps: true }
);

userSchema.pre("aggregate", function (next) {
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
    if (doc) {
      await Promise.all(
        doc instanceof Array
          ? [
            sendRPCRequest(doc, TAXONOMY_RPC, ["fonction"], "VIEW_ITEMS", {
              queryOptions: { select: "-children -parent -domain" },
            }),
          ]
          : [
            sendRPCRequest(doc, TAXONOMY_RPC, ["fonction"], "VIEW_ITEM", {
              queryOptions: { select: "-children -parent -domain" },
            }),
          ]
      ).then((result) => {
        if (doc instanceof Array) {
          doc.map((d) => {
            if (d["fonction"])
              d["fonction"] =
                result[0].find(
                  (item) => item._id === (d["fonction"]?._id || d["fonction"])
                ) || d["fonction"];
          });
        } else {
          if (doc["fonction"])
            doc["fonction"] = result[0] || doc["fonction"];
        }
      });
    }
  } catch (error) {
    throw new Error(error);
  }
}
userSchema.post(/find.*|save/, async function (doc, next) {
  try {
    await distantRequest(doc);
    next();
  } catch (err) {
    next(err);
  }
});
userSchema.post("save", async function (doc, next) {
  try {
    if (this.groupe) {
      await Group.updateOne(
        { _id: this.groupe.toString() },
        { $addToSet: { users: this._id } }
      );
    }
    next();
  } catch (error) {
    next(error);
  }
});
userSchema.post("insertMany", async function (doc, next) {
  try {
    await distantRequest(doc);

    let groupe = GroupBy(doc, "groupe");
    for (let item of Object.keys(groupe))
      if (item) {
        await Group.updateOne(
          { _id: item.toString() },
          { $addToSet: { users: { $each: groupe[item].map((d) => d._id) } } }
        );
      }
    next();
  } catch (error) {
    next(error);
  }
});
userSchema.pre("findOneAndUpdate", async function (next) {
  try {
    let doc = await user.findOne(this.getQuery()).lean();

    const groupeId = this._update?.["$set"]?.groupe;
    if (groupeId && doc?.groupe != groupeId && doc?.groupe != undefined) {
      await Group.updateOne(
        { _id: doc.groupe.toString() },
        { $pull: { users: doc._id } }
      );
    }
    next();
  } catch (error) {
    next(error);
  }
});
userSchema.post("findOneAndUpdate", async function (doc, next) {
  try {
    if (doc.groupe) {
      await Group.updateOne(
        { _id: doc.groupe?._id?.toString() || doc.groupe },
        { $addToSet: { users: doc._id } }
      );
    }
    next();
  } catch (error) {
    next(error);
  }
});

const user = mongoose.model("user", userSchema);
module.exports = user;

const Group = require("./group.model");
const { GroupBy, sendRPCRequest } = require("../helpers/helpers");
const { TAXONOMY_RPC } = require("../config");
