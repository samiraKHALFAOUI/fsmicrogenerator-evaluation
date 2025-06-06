const client = require('prom-client');

// Create a dedicated registry for this service
const register = new client.Registry();

// 🚀 Enable collection of Node.js default system metrics (CPU, memory, event loop, heap, etc.)
client.collectDefaultMetrics({ register });

// 🔢 METRIC 1: Counter for total HTTP requests (by method, route, and status)
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

// ⏱️ METRIC 2: Histogram for duration of HTTP requests
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.3, 0.5, 1, 1.5, 2, 5] // Adjustable based on your needs
});

// 🛠 METRIC 3: Gauge for the number of in-progress HTTP requests
const httpRequestsInProgress = new client.Gauge({
  name: 'http_requests_in_progress',
  help: 'Number of HTTP requests currently being processed',
  labelNames: ['method', 'route'],
});

// 🎯 METRIC 4: Business-specific counter — e.g., number of products created
const businessProductCreated = new client.Counter({
  name: 'product_created_total',
  help: 'Total number of products created',
});

// Register all metrics
register.registerMetric(httpRequestsTotal);
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestsInProgress);
register.registerMetric(businessProductCreated);

// Export the registry and metrics for use in app.js or other modules
module.exports = {
  register,
  httpRequestsTotal,
  httpRequestDuration,
  httpRequestsInProgress,
  businessProductCreated,
};
