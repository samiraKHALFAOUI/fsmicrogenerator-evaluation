const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const serviceRegistrySchema = new Schema(
  {
    serviceName: { type: String, required: true, unique: true },
    index: { type: Number, default: 0 },
    instances: {
      type: [
        {
          serviceName: { type: String, required: true },
          protocol: { type: String, required: true },
          host: { type: String, required: true },
          port: { type: String, required: true },
          role: { type: [String] },
          url: { type: String, unique: true },
          status: { type: String, default: 'enabled' },
          createdAt: { type: Date, default: new Date() },
          lastUpdate: { type: Date },
          _id: false
        },
      ],
    },
    loadBalanceStrategy: { type: String, default: "ROUND_ROBIN" }

  },
  { timestamps: true }
);


const serviceRegistry = mongoose.model("serviceRegistry", serviceRegistrySchema);
module.exports = serviceRegistry;
