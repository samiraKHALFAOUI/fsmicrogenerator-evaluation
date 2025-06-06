const { SubscribeMessage, RPCObserver } = require("../helpers/communications");
const controller = require("../controllers/customer.controller");

module.exports.CustomerObserver = () => {
  RPCObserver("CUSTOMER_CUSTOMERMANAGEMENT_RPC", controller);
};
module.exports.CustomerReceiver = () => {
  const queues = ["CUSTOMER_CUSTOMERMANAGEMENT_QUEUE"];
  for (let q of queues) {
    SubscribeMessage(controller, "CUSTOMER_CUSTOMERMANAGEMENT_KEY", q);
  }
};
