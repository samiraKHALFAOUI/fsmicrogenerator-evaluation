const { SubscribeMessage, RPCObserver } = require("../helpers/communications");
const controller = require("../controllers/inventory.controller");

module.exports.InventoryObserver = () => {
  RPCObserver("INVENTORY_INVENTORYMANAGEMENT_RPC", controller);
};
module.exports.InventoryReceiver = () => {
  const queues = ["INVENTORY_INVENTORYMANAGEMENT_QUEUE"];
  for (let q of queues) {
    SubscribeMessage(controller, "INVENTORY_INVENTORYMANAGEMENT_KEY", q);
  }
};
