/**
 * middleware/rateLimiter.js
 *
 * Express middleware that enforces rate limits per IP or authenticated user.
 * Uses:
 *   - Redis for fast counter increments and caching of whitelist rules.
 *   - Mongoose (MongoDB) for dynamic whitelist entries.
 *   - Static .env-based whitelist for quick configuration.
 *   - JWT to identify authenticated users (optional).
 */

const logger = require('./winston.middleware')
const WhitelistModel = require('../models/whitelist.model');
const cacheService = require('../cache/redis.service');
const { normalizeIP, allowedIPs } = require('./authorization.middleware');
const { jwtVerify } = require('../helpers/helpers');




/**
 * getRateLimit
 * -------------
 * Determines the rate limit config for the requester.
 * 1. Check Redis cache for a stored rule.
 * 2. Fallback to static .env whitelist.
 * 3. Fallback to dynamic MongoDB whitelist.
 * 4. Cache the MongoDB result in Redis for 10 minutes.
 *
 * @param {string} ip     - the client's IP address
 * @param {string|null} userId - the authenticated user's ID, or null
 * @returns {Promise<{window: number, limit: number}|null>}
 */
async function getRateLimit(ip, userId) {
    
    const cacheKey = userId
        ? `whitelist:user:${userId}`
        : `whitelist:ip:${ip}`;
    // 1) Try Redis cache
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    // 2) Check static .env whitelist
    if (allowedIPs.has(ip)) {
        // e.g. internal IPs: unlimited requests (exemple prometheus)
        return { limit: 0 };
    }

    // 3. Check MongoDB whitelist
    const query = userId
        ? { type: 'user', key: userId }
        : { type: 'ip', key: ip };

    const entry = await WhitelistModel.findOne(query).lean();
    if (entry?.rateLimit) {
        await cacheService.set(cacheKey, entry.rateLimit, ["whitelist"]); 
        return entry.rateLimit;
    }

    return null;
}

/**
 * logBlockedRequest
 * -----------------
 * Logs blocked requests (could be expanded to write to MongoDB).
 *
 * @param {string} ip
 * @param {string|null} userId
 * @param {string} route
 */
function logBlockedRequest(ip, userId, route) {
    logger.warn(`[RateLimiter] Blocked ${userId || ip} on ${route} at ${new Date().toISOString()}`);
}

/**
 * rateLimiter middleware
 */
module.exports = async function rateLimiter(req, res, next) {
    const ip = normalizeIP(req.ip);
    const route = req.path;
    let userId = null;

    // 1) Extract userId from JWT if present
    const token = req.headers[process.env.TOKEN_FIELD_NAME];
    if (token) {
        try {
            const payload = jwtVerify(token);
            userId = payload.userId || payload.auth;
            req.user = payload;
        } catch (err) {
            logger.warn(`[RateLimiter] Blocked ${userId || ip} on ${route} at ${new Date().toISOString()} because of invalid token`);
            return res.status(401).json({ error: 'Invalid token' });
        }
    }

    // 2) Determine the applicable rate limit
    const override = await getRateLimit(ip, userId);
    const config = override || { window: 900, limit: 100 }; // default: 100 req per 15min
    // 3) If limit === 0 → unlimited access
    if (config.limit === 0) {
        return next();
    }

    // 4) Use Redis to count requests in the window
    const keyId = userId ? `user:${userId}` : `ip:${ip}`;
    const rateKey = `rate:${route}:${keyId}`;

    const current = await cacheService.get(rateKey);
    logger.info(`ip :${ip} ,  route : ${route} , window : ${config.window}, limit : ${config.limit} ,current : ${current}`)

    if (current !== null && parseInt(current) >= config.limit) {
        await logBlockedRequest(ip, userId, route);
        return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
    }

    // 5) Atomically increment and set expiry
    try {
        // Get + update counter
        const newCount = current ? parseInt(current) + 1 : 1;
        const ttl = current ? undefined : config.window; // only set TTL if it's the first time
        await cacheService.set(rateKey, newCount, ["whitelist"], ttl);
    } catch (err) {
        logger.error(`Error setting rate limit counter: ${err.message}`);
    }

    next();
};
