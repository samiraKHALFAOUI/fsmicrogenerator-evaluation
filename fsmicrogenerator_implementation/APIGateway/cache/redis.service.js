const { redisClient } = require("./redisClient");
const logger = require("../middlewares/winston.middleware");
const DEFAULT_TTL = process.env.REDIS_TTL || 3600;

/**
 * Checks that the Redis connection is ready
 * @returns {boolean}
 */
function isRedisAvailable() {
  return redisClient && redisClient.isReady;
}

const cacheService = {
  /**
   * Generates a unique cache key
   * @param {string} prefix - model name in lowercase, Example: "user"
   * @param {string} action - Example: "all", "byId", "one", "statistic"
   * @param {object} params - Subject of influential parameters such as populate, options, conditions
   * @returns {string}
   */
  generateCacheKey(prefix, action, params = {}) {
    const base = { action, ...params };
    return `${prefix}:${JSON.stringify(base)}`;
  },

  async get(key) {
    if (!isRedisAvailable()) {
      logger.warn(`Redis not ready. Skipping GET: ${key}`);
      return null;
    }

    try {
      const data = await redisClient.get(key);
      if (data) {
        //logger.info(`Cache hit: ${key}`);
        return JSON.parse(data);
      }
      //logger.warn(`Cache miss: ${key}`);
      return null;
    } catch (err) {
      logger.error(`Redis GET error: ${err.message}`);
      return null;
    }
  },

  async set(key, value, tags = [], ttl = DEFAULT_TTL) {
    if (!isRedisAvailable()) {
      logger.warn(`Redis not ready. Skipping SET: ${key}`);
      return;
    }

    try {
      await redisClient.set(key, JSON.stringify(value), { EX: ttl });
      for (const tag of tags) {
        await redisClient.sAdd(`tag:${tag}`, key);
      }
      //logger.info(`Cache set: ${key} (TTL: ${ttl}s)`);
    } catch (err) {
      logger.error(`Redis SET error: ${err.message}`);
    }
  },

  async del(key) {
    if (!isRedisAvailable()) {
      logger.warn(`Redis not ready. Skipping DEL: ${key}`);
      return;
    }

    try {
      await redisClient.del(key);
      //logger.info(`Cache deleted: ${key}`);
    } catch (err) {
      logger.error(`Redis DEL error: ${err.message}`);
    }
  },

  async invalidateTag(tag) {
    if (!isRedisAvailable()) {
      logger.warn(`Redis not ready. Skipping invalidateTag: ${tag}`);
      return;
    }

    try {
      const keys = await redisClient.sMembers(`tag:${tag}`);
      if (keys.length > 0) {
        await redisClient.del(...keys);
        //logger.info(`Tag invalidated: ${tag} (${keys.length} keys)`);
      }
      await redisClient.del(`tag:${tag}`);
    } catch (err) {
      logger.error(`Redis TAG invalidation error: ${err.message}`);
    }
  }
};

module.exports = cacheService;
