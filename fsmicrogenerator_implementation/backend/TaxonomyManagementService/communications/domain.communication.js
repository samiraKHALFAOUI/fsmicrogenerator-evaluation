const { SubscribeMessage, RPCObserver } = require("../helpers/communications");
const controller = require("../controllers/domain.controller");

module.exports.DomainObserver = () => {
  RPCObserver("DOMAIN_TAXONOMYMANAGEMENT_RPC", controller);
};
module.exports.DomainReceiver = () => {
  const queues = ["DOMAIN_TAXONOMYMANAGEMENT_QUEUE"];
  for (let q of queues) {
    SubscribeMessage(controller, "DOMAIN_TAXONOMYMANAGEMENT_KEY", q);
  }
};
