'use strict';
var logger = require('winston');
var constants = require('./constants');

logger.add(logger.transports.File, {
	filename : constants.LOG_FILE_PATH,
	maxsize : constants.LOG_FILE_MAX_SIZE,
	maxFiles : constants.TOTAL_LOG_FILE,
	timestamp: true
	}
);

logger.level = constants.LOG_LEVEL;
exports.logger = logger;
