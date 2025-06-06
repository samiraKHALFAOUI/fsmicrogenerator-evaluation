const express = require("express");
const app = express();

const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const fs = require("fs");
const { exec } = require("child_process");

const { swaggerUi, swaggerSpec } = require('./docs/swagger');
const { validateToken } = require("./middlewares/token.validation.middleware");
const { redisClient } = require("./cache/redisClient");
const logger = require("./middlewares/winston.middleware");
// Prometheus Metrics
const {
  register,
  httpRequestsTotal,
  httpRequestDuration,
  httpRequestsInProgress,
} = require("./helpers/metrics");

// #region Routes Declaration
const authRouter = require("./routes/authentication.routes");
const whitelistRouter = require("./routes/whitelist.routes");
const serviceRegistryRoutes = require("./routes/serviceRegistry.routes");
const proxyRoutes = require("./routes/proxy.routes");
// #endregion

// #region Environment Configuration
if (process.env.NODE_ENV !== "prod") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotenv.config({ path: configFile });
  if (process.env.NODE_ENV === "dev") {
    const dbFlagFile = "../utils/database/databaseWasImported.txt";
    const restoreScript = "cd ../utils/database;./restoredb.sh";

    if (!fs.existsSync(dbFlagFile)) {
      exec(restoreScript, (err, stdout, stderr) => {
        if (err) {
          logger.error(`Database restore script failed: ${err.message}`);
        } else {
          fs.writeFile(dbFlagFile, "done", (err) => {
            if (err) logger.error("Failed to write import flag file");
          });
        }
      });
    }
  }
} else {
  dotenv.config();
}
// #endregion


// #region MongoDB Connection
const dbName = process.env.DBNAME;
const dbURL = `${process.env.URL}${dbName}`;

mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose
  .connect(dbURL)
  .then(() => logger.info(`Connected to MongoDB: ${dbName}`))
  .catch((error) => logger.error(`MongoDB connection error: ${error.message}`));
// #endregion

//  Resolution of authorized sources and rate limiting
const { resolveAllowedSourcesFromEnv, isRequesterAllowed } = require("./middlewares/authorization.middleware");
resolveAllowedSourcesFromEnv();
const rateLimiterMiddleware = require("./middlewares/rateLimiter.middleware");

// #region Middleware Setup
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan("dev"));

// Authorization Middleware
app.use((req, res, next) => {
  const requesterIP = req.ip || req.connection.remoteAddress;

  if (!isRequesterAllowed(requesterIP)) {
    logger.warn(`Access denied for IP: ${requesterIP} : ${req.method}--${req.originalUrl}`);
    return res.status(403).json({ error: "Access denied" });
  }
  next()
})

// Rate Limiting Middleware
app.use(rateLimiterMiddleware);

// Prometheus HTTP Metrics Middleware
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer({ method: req.method, route: req.path });
  httpRequestsInProgress.inc({ method: req.method, route: req.path });

  res.on("finish", () => {
    httpRequestsTotal.inc({ method: req.method, route: req.path, status: res.statusCode });
    httpRequestsInProgress.dec({ method: req.method, route: req.path });
    end({ method: req.method, route: req.path, status: res.statusCode });
  });

  next();
});
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  next();
});
// #endregion

// #region Routes

// Prometheus Metrics Endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// Health Check Endpoint
app.use("/health", async (req, res) => {
  const serviceName = process.env.SERVICENAME || "API Gateway";

  // MongoDB
  const mongoConnected = mongoose.connection.readyState === 1;
  const mongoStatus = mongoConnected ? "CONNECTED" : "DISCONNECTED";

  // Redis
  let redisConnected = false;
  let redisStatus = "DISCONNECTED";
  try {
    await redisClient.ping();
    redisConnected = true;
    redisStatus = "CONNECTED";
  } catch (error) {
    logger.error(`Redis connection error: ${error.message}`);
  }

  const allOk = mongoConnected && redisConnected;
  const response = {
    service: serviceName,
    mongo: mongoStatus,
    redis: redisStatus,
  };

  if (allOk) {
    return res.status(200).json(response);
  } else {
    return res.status(500).json({
      ...response,
      error: "One or more dependencies are not connected",
    });
  }
});
app.use("/api/authentication", authRouter);

// Swagger Route For API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Token Validation Middleware
app.use(validateToken());
app.use("/whitelists", whitelistRouter);
app.use("/registries", serviceRegistryRoutes);
app.use("/api", proxyRoutes);
// #endregion

// #region Error Handling
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const errorStatus = error.status || 500;
  logger.error(`HTTP ${errorStatus} - ${error.message}`);
  res.status(errorStatus).json({
    error: {
      message: error.message,
      status: errorStatus,
    },
  });
});
// #endregion

module.exports = app;
