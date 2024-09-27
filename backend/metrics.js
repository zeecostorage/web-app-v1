const client = require('prom-client');  // Import the Prometheus client
const register = new client.Registry();

const metrics = new client.Gauge({
  name: 'requests_total',
  help: 'Total number of requests',
  registers: [register],
});

// Middleware to count requests
const requestCounter = (req, res, next) => {
  metrics.inc(); // Increment the counter
  next();
};

// Add the requestCounter middleware
module.exports = (req, res, next) => {
  requestCounter(req, res, next);

  // Metrics endpoint
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
};

