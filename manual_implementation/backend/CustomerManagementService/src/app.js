const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const errorHandler = require("./middleware/error.middleware");
const customerRoutes = require("./routes/customer.routes");
const path = require("path");

// Load env vars
dotenv.config();
const RabbitMQ = require("./middleware/rabbitmq");

const {
  handleMessage,
  handleRPCMessage,
} = require("./middleware/consumeHandler");

(async () => {
  const rabbit = new RabbitMQ("inventory_system");
  await rabbit.connect();

  await rabbit.consume("customer_queue", "customer_key", handleMessage);

  await rabbit.rpcServer("customer_rpc", handleRPCMessage);
})();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Set security headers
app.use(helmet());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Serve static files from uploads directory
// app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), (req, res, next) => {
    console.log("Requested file:", req.originalUrl);
    next();
  })
);

// Mount routes
app.use("/api/customers", customerRoutes);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});
