/**
 * Global Error Handler Middleware
 * Catches any errors passed via next(err) and formats them consistently.
 * Must be registered LAST in the Express middleware chain.
 */

/**
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next - unused but required by Express signature
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  console.error(`[ERROR] ${req.method} ${req.path} →`, err.message);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
