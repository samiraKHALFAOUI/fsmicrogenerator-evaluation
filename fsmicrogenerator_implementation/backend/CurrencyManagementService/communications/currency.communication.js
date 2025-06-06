const { SubscribeMessage, RPCObserver } = require("../helpers/communications");
const controller = require("../controllers/currency.controller");

module.exports.CurrencyObserver = () => {
  RPCObserver("CURRENCY_CURRENCYMANAGEMENT_RPC", controller);
};
module.exports.CurrencyReceiver = () => {
  const queues = ["CURRENCY_CURRENCYMANAGEMENT_QUEUE"];
  for (let q of queues) {
    SubscribeMessage(
      controller,
      "CURRENCY_CURRENCYMANAGEMENT_KEY",
      q
    );
  }
};
