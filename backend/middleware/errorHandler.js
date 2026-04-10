const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
 
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server Error: Kuch toh gadbad hai daya!';

  res.status(statusCode).json({
    success: false,
    message: message,
    
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;