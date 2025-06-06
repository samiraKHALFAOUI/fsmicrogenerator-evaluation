const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let groupSchema = new Schema(
  {
    etatObjet: { type: String, default: "code-1" },
    etatUtilisation: { type: String, enum: ["code_4316", "code_4317"] },
    translations: {
      type: [
        {
          language: { type: String },
          designation: { type: String, required: true },
        },
      ],
    },
    espaces: { type: [Object], required: true },
    users: [{ type: Schema.Types.ObjectId, ref: "user" }],
    superGroup: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const populateField = [
  { path: "users", match: { etatObjet: "code-1" }, populate: [] },
];
groupSchema.pre(/find.*/, function (next) {
  try {
    this.populate(populateField);
    next();
  } catch (error) {
    next(error);
  }
});

groupSchema.pre("aggregate", function (next) {
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

const group = mongoose.model("group", groupSchema);
module.exports = group;
