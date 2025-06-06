const { SubscribeMessage, RPCObserver } = require("../helpers/communications");
const controller = require("../controllers/transactionLine.controller");

module.exports.TransactionLineObserver = () => {
  RPCObserver("TRANSACTIONLINE_TRANSACTIONMANAGEMENT_RPC", controller);
};
module.exports.TransactionLineReceiver = () => {
  const queues = ["TRANSACTIONLINE_TRANSACTIONMANAGEMENT_QUEUE"];
  for (let q of queues) {
    SubscribeMessage(
      controller,
      "TRANSACTIONLINE_TRANSACTIONMANAGEMENT_KEY",
      q
    );
  }
};
