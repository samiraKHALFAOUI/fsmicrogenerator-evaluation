const dns = require("node:dns");
const net = require("net");
const logger = require('./winston.middleware');
const whitelistModel = require("../models/whitelist.model");

const allowedIPs = new Set([
    '127.0.0.1',
    '::1',
    'localhost',
    '172.17.0.1',
    '172.18.0.1',
]);

// Checks if a value is an IP
function isIPAddress(value) {
    return net.isIP(value) !== 0;
}

// Cleans an IP of type "::ffff:172.18.0.1"
function normalizeIP(ip) {
    return ip.replace(/^::ffff:/, '');
}

// Resolves authorized sources from an environment variable
async function resolveAllowedSourcesFromEnv() {
    const sources = process.env.ALLOWED_SOURCES || '';
    const whitelist = await whitelistModel.find().select('ip').lean()
    whitelist.map((ip) => allowedIPs.add(ip))
    if (!allowedIPs.size) return;

    sources.split(',').map(src => src.trim()).forEach(source => {
        if (isIPAddress(source)) {
            allowedIPs.add(source);
            logger.info(`[Authz] Allowed IP directly: ${source}`);
        } else {
            dns.lookup(source, { family: 4 }, (err, address) => {
                if (!err && address) {
                    allowedIPs.add(address);
                    logger.info(`[Authz] Resolved: ${source} → ${address}`);
                } else {
                    logger.warn(`[Authz] Failed to resolve: ${source}`);
                }
            });
        }
    });
}

// Check if the IP is authorized
function isRequesterAllowed(ip) {
    const cleanedIP = normalizeIP(ip);

    // Accepts all IPs in the Docker subnet (172.x.x.x)
    if (cleanedIP.startsWith('172.')) return true;

    // Check if it is in the whitelist
    return allowedIPs.has(cleanedIP);
}

module.exports = {
    resolveAllowedSourcesFromEnv,
    isRequesterAllowed,
    normalizeIP,
    allowedIPs
};
