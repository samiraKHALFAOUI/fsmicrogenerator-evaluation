const { SubscribeMessage, RPCObserver } = require("../helpers/communications");
const controller = require("../controllers/category.controller");

module.exports.CategoryObserver = () => {
  RPCObserver("CATEGORY_PRODUCTMANAGEMENT_RPC", controller);
};
module.exports.CategoryReceiver = () => {
  const queues = ["CATEGORY_PRODUCTMANAGEMENT_QUEUE"];
  for (let q of queues) {
    SubscribeMessage(controller, "CATEGORY_PRODUCTMANAGEMENT_KEY", q);
  }
};
