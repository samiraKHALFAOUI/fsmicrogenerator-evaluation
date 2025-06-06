const { SubscribeMessage, RPCObserver } = require("../helpers/communications");
const controller = require("../controllers/group.controller");

module.exports.GroupObserver = () => {
  RPCObserver("GROUP_ACCOUNTMANAGEMENT_RPC", controller);
};
module.exports.GroupReceiver = () => {
  const queues = ["GROUP_ACCOUNTMANAGEMENT_QUEUE"];
  for (let q of queues) {
    SubscribeMessage(controller, "GROUP_ACCOUNTMANAGEMENT_KEY", q);
  }
};
