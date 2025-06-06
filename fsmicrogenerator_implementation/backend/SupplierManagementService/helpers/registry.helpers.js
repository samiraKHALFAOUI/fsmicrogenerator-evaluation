const axios = require("axios");
const { jwtSign } = require("./helpers");
const logger = require("../middlewares/winston.middleware");

/**
 * Retry an async function with exponential backoff.
 * @param {Function} fn - Async function to retry
 * @param {number} retries - Number of remaining attempts
 * @param {number} delay - Initial delay in ms
 * @returns {Promise<*>}
 */
async function retryRequest(fn, retries = process.env.RETRIES, delay = process.env.DELAY) {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) {
      logger.error(`Final retry failed: ${error.message}`);
      throw error;
    }

    logger.warn(`Retry failed. Retries left: ${retries}. Waiting ${delay}ms...`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryRequest(fn, retries - 1, delay * 2);
  }
}

/**
 * Register the service to the gateway registry.
 * Uses JWT for authentication.
 */
async function registerService() {
  const serviceName = process.env.SERVICENAME;
  const encodedAuthString = jwtSign({ auth: serviceName });

  const registerFn = async () => {
    const url = `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}`;
    logger.info(`Registering service: ${serviceName} at ${url}`);

    const response = await axios({
      method: "POST",
      url: `${process.env.GATEWAY}/registries/register`,
      headers: {
        jwt: encodedAuthString,
        "Content-Type": "application/json",
      },
      data: {
        serviceName,
        protocol: process.env.PROTOCOL,
        host: process.env.HOST,
        port: process.env.PORT
      },
    });

    logger.info(`Registration response: ${JSON.stringify(response.data)}`);
  };

  await retryRequest(registerFn).catch((error) => {
    logger.error(`Service registration failed after retries: ${error.message}`);
    throw error;
  });
}

/**
 * Unregister the service from the gateway registry.
 * Uses JWT for authentication.
 */
async function unregisterService() {
  const serviceName = process.env.SERVICENAME;
  const encodedAuthString = jwtSign({ auth: serviceName });

  const unregisterFn = async () => {
    logger.info(`Unregistering service: ${serviceName}`);

    await axios({
      method: "POST",
      url: `${process.env.GATEWAY}/registries/unregister`,
      headers: {
        jwt: encodedAuthString,
        "Content-Type": "application/json",
      },
      data: {
        serviceName,
        url: `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/`,
      },
    });

    logger.info(`Service ${serviceName} successfully unregistered.`);
  };

  await retryRequest(unregisterFn).catch((error) => {
    logger.error(`Service unregistration failed after retries: ${error.message}`);
    throw error;
  });
}

module.exports = {
  registerService,
  unregisterService,
};
