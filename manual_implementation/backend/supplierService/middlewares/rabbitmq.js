const amqplib = require('amqplib');
const { v4: uuidv4 } = require('uuid');
const logger = require('./winston.middleware')

class RabbitMQ {
    constructor(exchangeName) {
        this.exchange = exchangeName;
        this.channel = this.channel || null;
        this.connection = this.channel || null;
        this.responseHandlers = {};
    }

    async connect() {
        this.connection = await amqplib.connect(process.env.AMQ || 'amqp://localhost');
        this.channel = await this.connection.createChannel();
        await this.channel.assertExchange(this.exchange, 'direct', { durable: true });
        logger.info(`Successfully connected to rabbitmq ====> ${this.exchange}`)

        // Set up reply queue for RPC
        const { queue } = await this.channel.assertQueue('', { exclusive: true });
        this.replyQueue = queue;

        this.channel.consume(this.replyQueue, (msg) => {
            const correlationId = msg.properties.correlationId;
            const handler = this.responseHandlers[correlationId];
            if (handler) {
                handler(JSON.parse(msg.content.toString()));
                delete this.responseHandlers[correlationId];
            }
        }, { noAck: true });
    }

    async publish(routingKey, message) {
        const buffer = Buffer.from(JSON.stringify(message));
        logger.info(`publish to ====> ${routingKey}`)
        this.channel.publish(this.exchange, routingKey, buffer);
    }

    async consume(queueName, routingKey, handler) {
        await this.channel.assertQueue(queueName, { durable: true });
        await this.channel.bindQueue(queueName, this.exchange, routingKey);
        this.channel.consume(queueName, async (msg) => {
            if (msg) {
                logger.info(`consuming msg ====> ${queueName}===>${routingKey}`)
                const data = JSON.parse(msg.content.toString());
                await handler(data);
                this.channel.ack(msg);
            }
        });
    }

    // RPC CLIENT
    async rpcRequest(queue, message) {
        const correlationId = uuidv4();
        return new Promise((resolve) => {
            this.responseHandlers[correlationId] = resolve;
            logger.info(`send rpc request to ====> ${queue}`)
            this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
                correlationId,
                replyTo: this.replyQueue,
            });
        });
    }

    // RPC SERVER
    async rpcServer(queue, handler) {
        await this.channel.assertQueue(queue, { durable: false });
        this.channel.consume(queue, async (msg) => {
            logger.info(`received rpc request from ====> ${queue}`)
            const content = JSON.parse(msg.content.toString());
            const result = await handler(content);

            this.channel.sendToQueue(
                msg.properties.replyTo,
                Buffer.from(JSON.stringify(result)),
                { correlationId: msg.properties.correlationId }
            );
            this.channel.ack(msg);
        });
    }
}

module.exports = RabbitMQ;
