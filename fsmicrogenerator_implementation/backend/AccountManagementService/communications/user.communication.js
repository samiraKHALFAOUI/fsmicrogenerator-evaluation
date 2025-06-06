const { SubscribeMessage, RPCObserver } = require("../helpers/communications");
const controller = require("../controllers/user.controller");

module.exports.UserObserver = () => {
  RPCObserver("USER_ACCOUNTMANAGEMENT_RPC", controller);
};
module.exports.UserReceiver = () => {
  const queues = ["USER_ACCOUNTMANAGEMENT_QUEUE"];
  for (let q of queues) {
    SubscribeMessage(controller, "USER_ACCOUNTMANAGEMENT_KEY", q);
  }
};
