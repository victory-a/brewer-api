// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const ErrorResponse = require('../utils/errorResponse');

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ErrorResponse(message, 404);
  }

  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
