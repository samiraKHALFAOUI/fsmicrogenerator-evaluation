const { SubscribeMessage, RPCObserver } = require("../helpers/communications");
const controller = require("../controllers/taxonomy.controller");

module.exports.TaxonomyObserver = () => {
  RPCObserver("TAXONOMY_TAXONOMYMANAGEMENT_RPC", controller);
};
module.exports.TaxonomyReceiver = () => {
  const queues = ["TAXONOMY_TAXONOMYMANAGEMENT_QUEUE"];
  for (let q of queues) {
    SubscribeMessage(
      controller,
      "TAXONOMY_TAXONOMYMANAGEMENT_KEY",
      q
    );
  }
};
