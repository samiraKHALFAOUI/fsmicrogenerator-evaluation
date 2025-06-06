const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let enumerationSchema = new Schema(
  {
    etatObjet: { type: String, default: "code-1" },
    code: { type: String, required: true, unique: true },
    translations: {
      type: [
        {
          language: { type: String },
          valeur: { type: String, required: true },
          commentaire: { type: String },
        },
      ],
    },
    etatValidation: {
      type: String,
      required: true,
      enum: ["code_223", "code_4268", "code_1407", "code_1809"],
    },
  },
  { timestamps: true }
);

const enumeration = mongoose.model("enumeration", enumerationSchema);
module.exports = enumeration;
