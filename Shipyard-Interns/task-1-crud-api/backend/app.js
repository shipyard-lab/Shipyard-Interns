/**
 * Express Application Entry Point
 * Configures middleware, mounts routes, and starts the server.
 * Delegates actual app construction to src/app.js, making it safe
 * to run directly with node app.js or import by tests.
 */

const app = require('./src/app');
const PORT = process.env.PORT || 5000;

// Start Server (only when run directly)
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
  });
}

module.exports = app;
