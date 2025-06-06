const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let currencySchema = new Schema(
  {
    etatObjet: { type: String, default: "code-1" },
    currency: { type: String, required: true, unique: true },
    typeCurrency: {
      type: String,
      required: true,
      enum: ["code_3630", "code_3631"],
    },
    symbolCurrency: { type: String },
    exchangeRates: [{ type: Schema.Types.ObjectId, ref: "exchangeRate" }],
  },
  { timestamps: true }
);

const populateField = [
  { path: "exchangeRates", match: { etatObjet: "code-1" }, populate: [] },
];

currencySchema.pre("aggregate", function (next) {
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

currencySchema.pre(/find.*/, function (next) {
  try {
    this.populate(populateField);
    next();
  } catch (error) {
    next(error);
  }
});

const currency = mongoose.model("currency", currencySchema);
module.exports = currency;
