const amqplib = require("amqplib");
const { v4: uuid4 } = require("uuid");
const zlib = require("zlib");
const logger = require('../middlewares/winston.middleware');

let connection;
let channel;
let shouldReconnect = true; // Flag to control reconnect behavior

//#region === RabbitMQ Initialization ===

module.exports.InitializeChannel = async () => {
  try {
    if (!connection || !channel) {
      logger.info("Channel or connection doesn't exist. Creating...");
      channel = await this.CreateChannel();
    }
    return channel;
  } catch (error) {
    logger.error(`--------error InitializeChannel-------- ${error}`);
    throw error;
  }
};

module.exports.CreateChannel = async () => {
  try {
    channel = await this.GetChannel();
    await channel.assertExchange(process.env.EXCHANGE_NAME, "direct", true);
    return channel;
  } catch (error) {
    logger.error(`--------error CreateChannel-------- ${error}`);
    throw error;
  }
};

module.exports.GetChannel = async () => {
  try {
    if (!connection) {
      logger.info("No active RabbitMQ connection. Connecting...");
      connection = await amqplib.connect(process.env.MSG_QUEUE_URL);

      connection.on("close", () => {
        if (shouldReconnect) {
          logger.error(`RabbitMQ connection closed.`);
          connection = null;
          logger.info(`Reconnecting to RabbitMQ...`);
          setTimeout(() => this.GetChannel(), 5000);
        }
      });

      connection.on("error", (err) => {
        logger.error(`RabbitMQ connection error: ${err.message}`);
      });
    }

    if (!channel || channel.closed) {
      channel = await connection.createChannel();
      channel.prefetch(5);
      logger.info("Channel created.");

      channel.on("close", () => {
        if (shouldReconnect) {
          logger.error(`Channel closed.`);
          channel = null;
          logger.info(`Reconnecting channel to RabbitMQ...`);
          setTimeout(() => this.GetChannel(), 6000);
        }
      });

      channel.on("error", (err) => {
        logger.error(`Channel error: ${err.message}`);
      });
    }

    return channel;
  } catch (error) {
    logger.error(`--------error GetChannel--------${error}`);
    throw error;
  }
};

module.exports.CloseConnection = async () => {
  try {
    // Stop reconnecting on manual close
    shouldReconnect = false;

    if (channel) {
      await channel.close();
      logger.info("RabbitMQ channel closed.");
      channel = null;
    }
    if (connection) {
      await connection.close();
      logger.info("RabbitMQ connection closed.");
      connection = null;
    }
  } catch (error) {
    logger.error(`Error while closing RabbitMQ connection/channel: ${error}`);
    throw error;
  }
};

//#endregion

//#region === Publish/Subscribe (with gzip) ===

/**
 * Publishes a gzip-compressed message to the exchange.
 */
module.exports.PublishMessage = async (binding_key, message) => {
  try {
    if (!channel || channel.closed) {
      logger.info("Channel is not available or closed! Reinitializing channel for publish...");
      channel = await this.InitializeChannel();
    }
    logger.info(`***************try to publish to***************${binding_key}`);
    const compressed = zlib.gzipSync(Buffer.from(JSON.stringify(message)));
    channel.publish(
      process.env.EXCHANGE_NAME,
      binding_key,
      compressed,
      {
        contentEncoding: "gzip",
        contentType: "application/json"
      }
    );
    logger.info(`Sent To: ${binding_key}===>${message}`);
  } catch (error) {
    logger.error(`***************error PublishMessage***************${error}`);
    throw error;
  }
};

/**
 * Subscribes to a queue and decompresses gzip messages.
 */
module.exports.SubscribeMessage = async (service, binding_key, queue_name) => {
  try {
    if (!channel || channel.closed) {
      logger.info("Channel is not available or closed! Reinitializing channel for subscription...");
      channel = await this.InitializeChannel();
    }
    const appQueue = await channel.assertQueue(queue_name);

    channel.bindQueue(appQueue.queue, process.env.EXCHANGE_NAME, binding_key);

    logger.info(`Listening on queue: ${appQueue.queue}`);

    channel.consume(appQueue.queue, (message) => {
      try {
        let buffer = message.content;

        if (message.properties.contentEncoding === "gzip") {
          buffer = zlib.gunzipSync(buffer);
        }

        const payload = JSON.parse(buffer.toString());

        service.subscribeEvents(payload);

        logger.info(`[X] received form ==>${binding_key}`);
      } catch (err) {
        logger.error(`Decompression/handling error: ${err.message}`);
      }
    }, { noAck: true });

  } catch (error) {
    logger.error(`--------error SubscribeMessage-------- ${binding_key}`);
    throw error;
  }
};

//#endregion

//#region === RPC Handling (with gzip) ===

/**
 * Starts an RPC listener with gzip support.
 */
module.exports.RPCObserver = async (RPC_QUEUE_NAME, service) => {
  try {
    if (!channel || !connection) await this.GetChannel();

    await channel.assertQueue(RPC_QUEUE_NAME, { durable: true });
    channel.prefetch(1);

    logger.info(`RPC Observer active on: ${RPC_QUEUE_NAME}`);

    channel.consume(RPC_QUEUE_NAME, async (message) => {
      try {
        let buffer = message.content;

        if (message.properties.contentEncoding === "gzip") {
          buffer = zlib.gunzipSync(buffer);
        }

        const payload = JSON.parse(buffer.toString());
        const response = await service.serveRPCRequest(payload);

        const responseBuffer = zlib.gzipSync(Buffer.from(JSON.stringify(response)));

        channel.sendToQueue(
          message.properties.replyTo,
          responseBuffer,
          {
            correlationId: message.properties.correlationId,
            contentEncoding: "gzip",
            contentType: "application/json"
          }
        );

        channel.ack(message);
      } catch (err) {
        logger.error(`RPCObserver handler error: ${err.message}`);
        channel.nack(message, false, false);
      }
    }, { noAck: false });

  } catch (error) {
    logger.error(`--------error RPCObserver-------- ${RPC_QUEUE_NAME}`);
    throw error;
  }
};

/**
 * Sends an RPC request and returns the result.
 */
module.exports.requestData = async (RPC_QUEUE_NAME, requestPayload, uuid) => {
  try {
    if (!channel || !connection) await this.GetChannel();

    const q = await channel.assertQueue("", { exclusive: true });

    const buffer = zlib.gzipSync(Buffer.from(JSON.stringify(requestPayload)));

    channel.sendToQueue(
      RPC_QUEUE_NAME,
      buffer,
      {
        replyTo: q.queue,
        correlationId: uuid,
        contentEncoding: "gzip",
        contentType: "application/json"
      }
    );

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        logger.info(`${RPC_QUEUE_NAME}****** could not fulfill the request!`);
        resolve("API could not fulfill the request!");
      }, 200010);

      channel.consume(q.queue, (message) => {
        if (message.properties.correlationId === uuid) {
          clearTimeout(timeout);

          let response = message.content;

          if (message.properties.contentEncoding === "gzip") {
            response = zlib.gunzipSync(response);
          }

          resolve(JSON.parse(response.toString()));
        }
      }, { noAck: true });
    });

  } catch (error) {
    logger.error(`--------error requestData-------- ${RPC_QUEUE_NAME}`);
    throw error;
  }
};

/**
 * Wrapper for RPC request with auto-generated UUID.
 */
module.exports.RPCRequest = async (RPC_QUEUE_NAME, requestPayload) => {
  try {
    const uuid = uuid4();
    return await this.requestData(RPC_QUEUE_NAME, requestPayload, uuid);
  } catch (error) {
    throw error;
  }
};

//#endregion
