const { SubscribeMessage, RPCObserver } = require("../helpers/communications");
const controller = require("../controllers/supplier.controller");

module.exports.SupplierObserver = () => {
  RPCObserver("SUPPLIER_SUPPLIERMANAGEMENT_RPC", controller);
};
module.exports.SupplierReceiver = () => {
  const queues = ["SUPPLIER_SUPPLIERMANAGEMENT_QUEUE"];
  for (let q of queues) {
    SubscribeMessage(controller, "SUPPLIER_SUPPLIERMANAGEMENT_KEY", q);
  }
};
