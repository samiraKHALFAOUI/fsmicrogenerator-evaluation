const axios = require("axios");
const serviceRegistry = require("../models/serviceRegistry.model");
const loadbalancer = require("../helpers/loadbalancer");
const logger = require("../middlewares/winston.middleware");


/**
 * Redirects incoming requests to the appropriate authentication service instance using load balancing
 */
exports.redirectRequest = async (req, res) => {
  try {
    const service = await serviceRegistry
      .findOne({ "instances.role": "authentication" })
      .lean();

    if (!service || !service.instances.length) {
      return res.status(404).send("Authentication service doesn't exist");
    }

    // Set default load balance strategy if not defined
    if (!service.loadBalanceStrategy) {
      service.loadBalanceStrategy = "ROUND_ROBIN";
      await serviceRegistry.updateOne(
        { _id: service._id },
        { $set: { loadBalanceStrategy: service.loadBalanceStrategy } }
      ).exec();
    }

    // Get next instance index
    const newIndex = loadbalancer[service.loadBalanceStrategy](service);
    const path = req.params[0]
    // Update last used index
    await serviceRegistry.updateOne(
      { _id: service._id },
      { $set: { index: service.index } }
    ).exec();

    const url = `${service.instances[newIndex].url}authentication/${path}`;
    try {
      const response = await axios({
        method: req.method,
        url,
        headers: {
          ...req.headers,
          Accept: "*/*",
        },
        data: req.body,
        params: req.query,
        responseType: "arraybuffer",
        validateStatus: (status) => status >= 200 && status < 400,
      });

      res.status(response.status).send(response.data);
    } catch (error) {
      logger.error(`Auth → Proxy error to ${url}: ${error.message}`);
      res
        .status(error.response?.status || error.status || 500)
        .send(error.response?.data || error.message);
    }
  } catch (err) {
    logger.error(`Auth → Global proxy failure: ${err.message}`);
    res.status(400).send(err);
  }
};
