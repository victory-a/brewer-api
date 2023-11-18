// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const errorHandler = (err, _, res) => {
  const error = { ...err };

  error.message = err.message;

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
