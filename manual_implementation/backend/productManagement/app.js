const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

// Initialize Product Communication
const RabbitMQ = require('./middlewares/rabbitmq');
const { handleMessage, handleRPCMessage } = require('./middlewares/consumeHandler');

(async () => {
  const rabbit = new RabbitMQ('inventory_system');
  await rabbit.connect();

  await rabbit.consume('product_queue', 'product_key', handleMessage);

  await rabbit.rpcServer('product_rpc', handleRPCMessage);


})();

// DB connection
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.URL)
  .then(console.log("Connected to MongoDB", process.env.DBNAME))
  .catch((error) => console.log(error));

app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(cors());

// Routers
const produitRouter = require("./routes/produit.route");
const categorieRouter = require("./routes/categorie.route");

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

app.use("/categorie", categorieRouter);
app.use("/", produitRouter);

// Error handling
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const errorStatus = error.status || 500;
  res.status(errorStatus);
  res.json({
    error: {
      message: error.message,
      status: errorStatus,
    },
  });
});

// Cleanup on app termination
process.on('SIGTERM', () => {
  process.exit(0);
});

process.on('SIGINT', () => {
  process.exit(0);
});

module.exports = app;
