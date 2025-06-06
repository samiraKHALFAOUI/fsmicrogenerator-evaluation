const logger = require('./winston.middleware')
const cacheService = require('../cache/redis.service');
const { normalizeIP, allowedIPs } = require('./authorization.middleware');
const { jwtVerify } = require('../helpers/helpers');

/**
 *
 * @param {string} ip     
 * @param {string|null} userId 
 * @returns {Promise<{window: number, limit: number}|null>}
 */
async function getRateLimit(ip, userId) {
    const cacheKey = userId
        ? `whitelist:user:${userId}`
        : `whitelist:ip:${ip}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;
    if (allowedIPs.has(ip)) {
        return { limit: 0 };
    }
    return null;
}

/**
 *
 * @param {string} ip
 * @param {string|null} userId
 * @param {string} route
 */
function logBlockedRequest(ip, userId, route) {
    logger.warn(`[RateLimiter] Blocked ${userId || ip} on ${route} at ${new Date().toISOString()}`);
}

module.exports = async function rateLimiter(req, res, next) {
    const ip = normalizeIP(req.ip);
    const route = req.path;
    let userId = null;
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
    const override = await getRateLimit(ip, userId);
    const config = override || { window: 900, limit: 100 }; 
    if (config.limit === 0) {
        return next();
    }
    const keyId = userId ? `user:${userId}` : `ip:${ip}`;
    const rateKey = `rate:${route}:${keyId}`;
    const current = await cacheService.get(rateKey);
    logger.info(`ip :${ip} ,  route : ${route} , window : ${config.window}, limit : ${config.limit} ,current : ${current}`)
    if (current !== null && parseInt(current) >= config.limit) {
        await logBlockedRequest(ip, userId, route);
        return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
    }
    try {
        const newCount = current ? parseInt(current) + 1 : 1;
        const ttl = current ? undefined : config.window; 
        await cacheService.set(rateKey, newCount, ["whitelist"], ttl);
    } catch (err) {
        logger.error(`Error setting rate limit counter: ${err.message}`);
    }
    next();
};
