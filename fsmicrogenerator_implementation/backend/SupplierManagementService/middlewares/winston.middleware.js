const winston = require("winston");
require("winston-daily-rotate-file");

// Configure daily rotate file transport
const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: "logs/service-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

// Create logger instance
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    dailyRotateFileTransport,
  ],
  exitOnError: false, // Do not exit on handled exceptions
});

// Optional: handle uncaught errors globally
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  logger.error(err.stack);
});

process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});

module.exports = logger;
