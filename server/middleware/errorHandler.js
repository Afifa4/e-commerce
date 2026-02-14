// Send a JSON error response for any unhandled error
function errorHandler(err, req, res, next) {
  const code = err.statusCode || (err.name === "ValidationError" ? 400 : 500);
  res.status(code).json({
    success: false,
    message: err.message || "Internal server error",
  });
}

// When no route matches the request URL
function notFound(req, res, next) {
  res.status(404).json({ success: false, message: "Route not found" });
}

module.exports = { errorHandler, notFound };
