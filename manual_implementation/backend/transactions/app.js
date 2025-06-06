const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();



const RabbitMQ = require('./middlewares/rabbitmq');
const { handleMessage, handleRPCMessage } = require('./middlewares/consumeHandler');

(async () => {
  const rabbit = new RabbitMQ('inventory_system');
  await rabbit.connect();

  await rabbit.consume('transaction_queue', 'transaction_key', handleMessage);

  await rabbit.rpcServer('transaction_rpc', handleRPCMessage);


})();

// Routes Declaration
// DB connection
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.URL)
  .then(console.log("Connected to MongoDB", process.env.DB_NAME))
  .catch((error) => console.log(error));
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(cors());
// Routers
const transactionRoutes = require("./routes/transaction.routes");
const ligneTransactionRoutes = require("./routes/ligneTransaction.routes");
app.use("/", transactionRoutes);
app.use("/ligneTransactions", ligneTransactionRoutes);
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

// Handle graceful shutdown
process.on("SIGTERM", () => {
  process.exit(0);
});

process.on("SIGINT", () => {
  process.exit(0);
});

module.exports = app;
