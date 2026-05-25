/**
 * Global Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // 1. Log to console for the developer
  console.error('--- ❌ ERROR DETECTED ---');
  console.error(`Method: ${req.method} | URL: ${req.originalUrl}`);
  console.error(`Message: ${err.message}`);
  console.error(err.stack);
  console.error('-----------------------');

  // 2. Handle Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = 'Resource not found: Invalid ID format';
    error = { status: 404, message };
  }

  // 3. Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { status: 400, message };
  }

  // 4. Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { status: 400, message };
  }

  // 5. Send final response
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    // Only include stack trace in development mode
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;