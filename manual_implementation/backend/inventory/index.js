const express = require("express");
const mongoose = require("mongoose");
const amqp = require("amqplib");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
const app = express();
app.use(bodyParser.json());
dotenv.config();
// MongoDB
const dbString = process.env.DB_STRING || "mongodb://localhost:27017/inventory";
mongoose.connect(dbString);


// Mongoose Schema
const InventoryMovementSchema = new mongoose.Schema(
  {
    reference: String,
    type: { type: String, enum: ["ENTRY", "EXIT"] },
    raison: String,
    date: Date,
    quantity: Number,
    price: Number,
    product: mongoose.Types.ObjectId,
    transaction_ligne: mongoose.Types.ObjectId,
  },
  { timestamps: true }
);

const InventoryMovement = mongoose.model(
  "InventoryMovement",
  InventoryMovementSchema
);

// RabbitMQ setup
let channel;
let rpcReplyQueue;

const EXCHANGE_NAME = "inventory_system";
const ROUTING_KEY = "inventory_movement_key";
const QUEUE_NAME = "inventory_movement";
const PRODUCT_QUEUE = "product_key";
const PRODUCT_RPC_QUEUE = "product_rpc";

async function connectRabbitMQ() {
  const connection = await amqp.connect("amqp://localhost");
  channel = await connection.createChannel();

  // Exchange & queues
  await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
  const serviceQueue = await channel.assertQueue(QUEUE_NAME, { durable: true });

  await channel.bindQueue(serviceQueue.queue, EXCHANGE_NAME, ROUTING_KEY);

  // RPC reply queue
  const reply = await channel.assertQueue("", { exclusive: true });
  rpcReplyQueue = reply.queue;

  console.log("RabbitMQ ready. Waiting for messages on :", QUEUE_NAME);

  channel.consume(serviceQueue.queue, async (msg) => {
    if (!msg) return;
    const data = JSON.parse(msg.content.toString());

    try {
      if (data)
        if (!(data instanceof Array)) {
          let movement = new InventoryMovement({
            reference: data.reference,
            type: data.type,
            date: new Date(),
            quantity: data.quantity,
            price: data.price,
            product: data.product,
            transaction_ligne: data.transaction_ligne,
            raison: data.raison,
          });

          movement = await movement.save();
          console.log(movement)
          const signedQuantity =
            data.type === "ENTRY" ? data.quantity : -data.quantity;

          const stockUpdate = {
            type: 'UPDATE_PRODUCT_STOCK',
            id: data.product,
            body: { $inc: { stockQuantity: signedQuantity } },
          };
          console.log({ stockUpdate })
          channel.publish(
            EXCHANGE_NAME,
            PRODUCT_QUEUE,
            Buffer.from(JSON.stringify(stockUpdate)),
            {
              persistent: true,
            }
          );
        } else if (data.length) {
          for (let item of data) {
            let movement = new InventoryMovement({
              reference: item.reference,
              type: item.type,
              date: new Date(),
              quantity: item.quantity,
              price: item.price,
              product: item.product,
              raison: item.raison,
              transaction_ligne: item.transaction_ligne,
            });

            movement = await movement.save();
            console.log(movement)
            const signedQuantity =
              item.type === "ENTRY" ? item.quantity : -item.quantity;

            const stockUpdate = {
              type: 'UPDATE_PRODUCT_STOCK',
              id: item.product,
              body: { $inc: { stockQuantity: signedQuantity } },
            };
            console.log({ stockUpdate })
            channel.publish(
              EXCHANGE_NAME,
              PRODUCT_QUEUE,
              Buffer.from(JSON.stringify(stockUpdate)),
              {
                persistent: true,
              }
            );
          }
        }

      console.log("Movement recorded + product stock update sent");
      channel.ack(msg);
    } catch (err) {
      console.error("Processing error:", err.message);
      channel.nack(msg, false, false);
    }
  });
}

// RPC call to product-service
async function rpcFetchProducts(productIds) {
  return new Promise((resolve, reject) => {
    const correlationId = uuidv4();

    const message = {
      action: "get_products_by_ids",
      data: { _id: { $in: productIds } },
    };

    channel.consume(
      rpcReplyQueue,
      (msg) => {
        if (msg.properties.correlationId === correlationId) {
          const products = JSON.parse(msg.content.toString());
          resolve(products);
        }
      },
      { noAck: true }
    );

    channel.sendToQueue(
      PRODUCT_RPC_QUEUE,
      Buffer.from(JSON.stringify(message)),
      {
        correlationId,
        replyTo: rpcReplyQueue,
      }
    );
  });
}


// REST API



app.get("/inventory/product/:id", async (req, res) => {
  try {
    const movements = await InventoryMovement.find({ product: req.params.id });
    res.send(movements);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/", async (req, res) => {
  try {
    const movements = await InventoryMovement.find().lean();
    const productIds = [...new Set(movements.map((m) => m.product.toString()))];
    const products = await rpcFetchProducts(productIds);
    let newData = movements.map(
      (m) =>
      (m.product = products.find(
        (p) => p._id.toString == m.product.toString()
      ))
    );
    res.send(newData);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Lancement serveur + RabbitMQ
app.listen(8004, () => {
  console.log("✅ Inventory service running on port 8004");
  connectRabbitMQ().catch((err) => console.error("RabbitMQ error:", err));
});
