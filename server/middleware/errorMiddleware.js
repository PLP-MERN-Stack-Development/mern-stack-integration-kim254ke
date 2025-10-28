// Middleware to handle 404 - Not Found errors
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Generic error handler middleware
// Note: Express recognizes this as an error handler because it has 4 arguments
const errorHandler = (err, req, res, next) => {
  // Check if status code is already set to an error status, otherwise default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
      message: err.message,
      // Only include the stack trace if we are in a development environment
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };
