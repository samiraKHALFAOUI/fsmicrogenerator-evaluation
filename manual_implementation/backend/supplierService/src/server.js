const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const supplierRoutes = require("./routes/supplier.routes");

dotenv.config();

const {
  handleRPCMessage,
  handleMessage,
} = require("../middlewares/consumeHandler");
const RabbitMQ = require("../middlewares/rabbitmq");

(async () => {
  const rabbit = new RabbitMQ("inventory_system");
  await rabbit.connect();

  await rabbit.consume("supplier_queue", "supplier_key", handleMessage);

  await rabbit.rpcServer("supplier_rpc", handleRPCMessage);
})();
const app = express();
const PORT = process.env.PORT || 8006;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/suppliers", supplierRoutes);

// MongoDB connection
const dbString = process.env.NODE_ENV === "production" ? process.env.MONGODB_URI : "mongodb://127.0.0.1/supplier-management"
mongoose
  .connect(dbString)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
