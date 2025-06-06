const axios = require("axios");
const serviceRegistry = require("../models/serviceRegistry.model");
const loadbalancer = require("../helpers/loadbalancer");
const FormData = require("form-data");
const multer = require("multer");
const logger = require("../middlewares/winston.middleware");

const upload = multer();

/**
 * Redirects incoming requests to the appropriate service instance using load balancing
 */
exports.redirectRequest = async (req, res) => {
  try {
    const serviceName = req.params[0]
    const path = req.params[1]
    const service = await serviceRegistry
      .findOne({ serviceName })
      .lean();

    if (!service || !service.instances.length) {
      logger.warn(`API Name doesn't exist : ${serviceName}`)
      return res.status(404).send(`API Name doesn't exist : ${serviceName}`);
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

    // Update last used index
    await serviceRegistry.updateOne(
      { _id: service._id },
      { $set: { index: service.index } }
    ).exec();

    const url = service.instances[newIndex].url;

    if (req.is("multipart/form-data")) {
      upload.any()(req, res, async (err) => {
        if (err) {
          return res.status(400).send({ error: "File upload error", details: err });
        }

        const formData = new FormData();

        req.files.forEach((file) => {
          formData.append(file.fieldname, file.buffer, file.originalname);
        });

        for (const [key, value] of Object.entries(req.body)) {
          formData.append(key, value);
        }

        try {
          const response = await axios({
            method: req.method,
            url: url + path,
            headers: {
              jwt: req.headers['jwt'],
              lang: req.headers['lang'],
              deflang: req.headers['deflang'],
              ...formData.getHeaders()
            },
            data: formData,
            params: req.query,
            validateStatus: (status) => status >= 200 && status < 400,
          });

          res.status(response.status).send(response.data);
        } catch (error) {
          logger.error(`Proxy error to ${url}${path}:: ${error.response?.data || error.message}`);
          res
            .status(error.response?.status || error.status || 500)
            .send(error.response?.data || error.message);
        }
      });
    } else {
      try {
        const response = await axios({
          method: req.method,
          url: url + path,
          headers: {
            ...req.headers,
            Accept: "*/*",
          },
          data: req.body,
          params: req.query,
          responseType: "arraybuffer",
          validateStatus: (status) => status >= 200 && status < 400,
        });

        if (path?.startsWith("upload") && response.headers["content-type"]) {
          res.setHeader("Content-Type", response.headers["content-type"]);
        }

        res.status(response.status).send(response.data);
      } catch (error) {
        logger.error(`Error while forwarding request to ${url}${path}: ${error.message}`);
        res
          .status(error.response?.status || error.status || 500)
          .send(error.response?.data || error.message);
      }
    }
  } catch (err) {
    logger.error(`Global proxy failure: ${err.message}`);
    res.status(400).send(err);
  }
};
