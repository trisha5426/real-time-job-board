const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create a write stream for access logs
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

// Custom log format
const logFormat = ':method :url :status :response-time ms - :res[content-length]';

// Logger middleware
const logger = morgan(logFormat, {
  stream: accessLogStream,
  skip: (req, res) => res.statusCode < 400 // Only log errors
});

// Console logger for development
const consoleLogger = morgan('dev');

module.exports = {
  logger,
  consoleLogger
};

