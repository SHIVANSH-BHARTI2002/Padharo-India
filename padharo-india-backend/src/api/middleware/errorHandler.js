const errorHandler = (err, req, res, next) => {
  console.error("-------------------- ERROR --------------------");
  console.error("Timestamp:", new Date().toISOString());
  console.error("Route:", req.method, req.originalUrl);
  console.error("Stack:", err.stack || err.message || err);
  console.error("-----------------------------------------------");

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorHandler;