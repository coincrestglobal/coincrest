const errorHandler = (err, req, res, next) => {
  // Default Error status and code
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Send error response
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // If we are in development, show the stack trace as well
    ...(process.env.NODE_ENV === "development" && { error: err.stack }),
  });
};

module.exports = errorHandler;
