const { SubscribeMessage, RPCObserver } = require("../helpers/communications");
const controller = require("../controllers/product.controller");

module.exports.ProductObserver = () => {
  RPCObserver("PRODUCT_PRODUCTMANAGEMENT_RPC", controller);
};
module.exports.ProductReceiver = () => {
  const queues = ["PRODUCT_PRODUCTMANAGEMENT_QUEUE"];
  for (let q of queues) {
    SubscribeMessage(controller, "PRODUCT_PRODUCTMANAGEMENT_KEY", q);
  }
};
