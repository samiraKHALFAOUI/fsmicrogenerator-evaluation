const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let exchangeRateSchema = new Schema(
  {
    etatObjet: { type: String, default: "code-1" },
    date: { type: Date },
    refCurrencyBase: {
      type: Schema.Types.ObjectId,
      ref: "currency",
      required: true,
    },
    refCurrencyEtrangere: {
      type: Schema.Types.ObjectId,
      ref: "currency",
      required: true,
    },
    valeurAchat: { type: Number },
    valeurVente: { type: Number },
    actif: { type: Boolean },
    currency: [{ type: Schema.Types.ObjectId, ref: "currency" }],
  },
  { timestamps: true }
);

// hooks
exchangeRateSchema.pre("save", async function (next) {
  try {
    let nbrItem = 0;
    if (this.currency) {
      nbrItem = await exchangeRate.countDocuments({
        etatObjet: "code-1",
        date: this.date,
        refCurrencyBase: {
          $in: [this.refCurrencyBase, this.refCurrencyEtrangere],
        },
        refCurrencyEtrangere: {
          $in: [this.refCurrencyBase, this.refCurrencyEtrangere],
        },
      });
      if (nbrItem === 0) {
        next();
      } else {
        next(
          new Error({
            name: "exchangeRateExiste",
            message: "taux change existe deja",
          })
        );
      }
    }
  } catch (error) {
    next(error);
  }
});

exchangeRateSchema.post("save", async function (doc, next) {
  try {
    if (this.currency?.length) {
      await Currency.updateMany(
        { _id: { $in: this.currency } },
        { $addToSet: { exchangeRates: this._id } }
      );
    }
    next();
  } catch (error) {
    next(error);
  }
});

exchangeRateSchema.pre("findOneAndUpdate", async function (next) {
  try {
    let doc = await exchangeRate.findOne(this.getQuery()).lean();
    if (doc) {
      const currencyIds = this._update?.["$set"]?.currency;
      let nbrItem = 0;
      if (currencyIds) {
        nbrItem = await exchangeRate.countDocuments({
          _id: { $ne: doc._id },
          etatObjet: "code-1",
          date: this._update?.["$set"]?.date,
          refCurrencyBase: {
            $in: [
              this._update?.["$set"]?.refCurrencyBase,
              this._update?.["$set"]?.refCurrencyEtrangere,
            ],
          },
          refCurrencyEtrangere: {
            $in: [
              this._update?.["$set"]?.refCurrencyBase,
              this._update?.["$set"]?.refCurrencyEtrangere,
            ],
          },
        });
        if (nbrItem === 0) {
          next();
        } else {
          next(
            new Error({
              name: "exchangeRateExiste",
              message: "exchange rate already exists",
            })
          );
        }
      }

      if (
        currencyIds &&
        doc?.currency &&
        doc?.currency?.length != currencyIds?.length
      ) {
        let ids = doc?.currency
          .map((item) => item._id || item)
          .filter((item) => !currencyIds.includes(item));
        await Currency.updateMany(
          { _id: { $in: ids } },
          { $pull: { exchangeRates: doc._id } }
        );
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});
exchangeRateSchema.post("findOneAndUpdate", async function (doc, next) {
  try {
    if (doc.currency) {
      await Currency.updateMany(
        { _id: { $in: doc.currency.map((d) => d._id || d) } },
        { $addToSet: { exchangeRates: doc._id } }
      );
    }
    next();
  } catch (error) {
    next(error);
  }
});

const exchangeRate = mongoose.model("exchangeRate", exchangeRateSchema);
module.exports = exchangeRate;

const Currency = require("../models/currency.model");
