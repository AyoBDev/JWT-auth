function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === 'P2025') {
    return res.status(404).json({ message: 'Resource not found' });
  }

  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
}

module.exports = errorHandler;
