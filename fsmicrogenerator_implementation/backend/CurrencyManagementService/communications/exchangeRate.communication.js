const { SubscribeMessage, RPCObserver } = require("../helpers/communications");
const controller = require("../controllers/exchangeRate.controller");

module.exports.ExchangeRateObserver = () => {
  RPCObserver("EXCHANGERATE_CURRENCYMANAGEMENT_RPC", controller);
};
module.exports.ExchangeRateReceiver = () => {
  const queues = ["EXCHANGERATE_CURRENCYMANAGEMENT_QUEUE"];
  for (let q of queues) {
    SubscribeMessage(
      controller,
      "EXCHANGERATE_CURRENCYMANAGEMENT_KEY",
      q
    );
  }
};
