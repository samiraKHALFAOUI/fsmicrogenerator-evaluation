const RabbitMQ = require('./rabbitmq');

let instance = null;

async function getRabbitInstance() {
  if (!instance) {
    instance = new RabbitMQ('inventory_system');
    await instance.connect();
  }
  return instance;
}

module.exports = getRabbitInstance;