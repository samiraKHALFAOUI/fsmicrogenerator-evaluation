const redis = require('redis');
const logger = require("../middlewares/winston.middleware");

const RETRIES = parseInt(process.env.RETRIES, 10) || 3;
const DELAY = parseInt(process.env.DELAY, 10) || 1000;

let shouldReconnect = true;  // <-- control reconnects

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      if (!shouldReconnect) {
        logger.info('Redis reconnect disabled by manual shutdown.');
        return new Error('Manual Redis shutdown - no reconnect');
      }

      logger.warn(`Redis reconnect attempt #${retries}`);

      if (retries > RETRIES) {
        logger.error('Too many Redis reconnection attempts. Giving up.');
        return new Error('Redis reconnection failed');
      }

      return Math.min(retries * DELAY, DELAY * RETRIES);
    }
  }
});

// Event handlers
redisClient.on('connect', () => {
  logger.info('Connecting to Redis...');
});

redisClient.on('ready', () => {
  logger.info('Redis connection established successfully');
});

redisClient.on('error', (err) => {
  logger.error(`Redis Client Error: ${err.message}`);
});

redisClient.on('end', () => {
  logger.warn('Redis connection closed');
});

redisClient.on('reconnecting', () => {
  logger.info('Attempting to reconnect to Redis...');
});

// Connect immediately
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    logger.error(`Failed to connect to Redis: ${err.message}`);
  }
})();

// Graceful shutdown function
async function closeRedisConnection() {
  try {
    // Disable reconnect attempts
    shouldReconnect = false;

    if (redisClient.isOpen) {
      await redisClient.quit();
      logger.info('Redis connection closed gracefully');
    }
  } catch (error) {
    logger.error(`Error closing Redis connection: ${error.message}`);
    throw error;
  }
}

module.exports = {
  redisClient,
  closeRedisConnection,
};
