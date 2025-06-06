const { Handler } = require("../helpers/helpers");
const serviceRegistry = require("../models/serviceRegistry.model");
const logger = require("../middlewares/winston.middleware");
const { generatePrometheusTargets } = require("../helpers/prometheus.helpers");
/**
 * Register a new service instance or re-enable an existing one
 * @type {Handler}
 */
exports.register = async (req, res) => {
  try {
    const { serviceName, protocol, host, port } = req.body;
    const url = `${protocol}://${host}:${port}/`;
    req.body.url = url;

    let service = await serviceRegistry.findOne({ serviceName }).lean();

    if (!service) {
      const newService = new serviceRegistry({
        serviceName,
        instances: [req.body]
      });
      await newService.save();
    } else {
      const instance = service.instances.find((i) => i.url === url);
      if (!instance) {
        service = await serviceRegistry.findByIdAndUpdate(
          service._id,
          { $addToSet: { instances: req.body } },
          { new: true }
        );
      } else if (instance.status !== "enabled") {
        service = await serviceRegistry.findOneAndUpdate(
          { _id: service._id, "instances.url": instance.url },
          {
            $set: {
              "instances.$.status": "enabled",
              "instances.$.lastUpdate": new Date()
            }
          },
          { new: true }
        );
      } else {
        return res
          .status(200)
          .send(`Configuration already exists for ${serviceName} at ${url}`);
      }
    }
    generatePrometheusTargets();
    return res.status(201).send(`Successfully registered ${serviceName}`);
  } catch (err) {
    logger.error(`Register error: ${err.message}`);
    return res.status(400).send(err);
  }
};

/**
 * Unregister an existing service instance
 * @type {Handler}
 */
exports.unregister = async (req, res) => {
  try {
    const { serviceName, url } = req.body;
    logger.info(`Trying to unregister: ${serviceName} at ${url}`);

    let service = await serviceRegistry
      .findOne({
        serviceName,
        "instances.url": url
      })
      .lean();

    if (!service) {
      return res.status(404).send(`No ${serviceName} was registered at ${url}`);
    }

    service = await serviceRegistry
      .findByIdAndUpdate(
        service._id,
        { $pull: { instances: { url } } },
        { new: true }
      )
      .lean();

    if (!service.instances.length) {
      await serviceRegistry.deleteOne({ _id: service._id }).exec();
    }
    generatePrometheusTargets();
    return res.status(200).send(`Successfully unregistered ${serviceName}`);
  } catch (err) {
    logger.error(`Unregister error: ${err.message}`);
    return res.status(400).send(err);
  }
};

/**
 * Update the status of a service instance
 * @type {Handler}
 */
exports.updateState = async (req, res) => {
  try {
    const { serviceName, url, status } = req.body;
    
    const service = await serviceRegistry
      .findOne({
        serviceName,
        "instances.url": url
      })
      .lean();

    if (!service) {
      return res
        .status(404)
        .send(`Unable to update state: no ${serviceName} registered at ${url}`);
    }

    await serviceRegistry
      .findOneAndUpdate(
        { serviceName, "instances.url": url },
        { $set: { "instances.$.status": status } },
        { new: true }
      )
      .lean();
    generatePrometheusTargets();
    return res
      .status(200)
      .send(`Successfully updated ${serviceName} instance status`);
  } catch (err) {
    logger.error(`Update state error: ${err.message}`);
    return res.status(400).send(err);
  }
};


