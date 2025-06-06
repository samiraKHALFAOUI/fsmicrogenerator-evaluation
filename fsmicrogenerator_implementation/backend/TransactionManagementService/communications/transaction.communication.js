const { SubscribeMessage, RPCObserver } = require("../helpers/communications");
const controller = require("../controllers/transaction.controller");

module.exports.TransactionObserver = () => {
  RPCObserver("TRANSACTION_TRANSACTIONMANAGEMENT_RPC", controller);
};
module.exports.TransactionReceiver = () => {
  const queues = ["TRANSACTION_TRANSACTIONMANAGEMENT_QUEUE"];
  for (let q of queues) {
    SubscribeMessage(
      controller,
      "TRANSACTION_TRANSACTIONMANAGEMENT_KEY",
      q
    );
  }
};
