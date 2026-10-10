'use strict';
var constants = require('./constants.js');
var errorConstants = require('./errorconstants.js');
var log = require('./logger');
var logger = log.logger;

exports.error = function(errorObject, response) {
//    console.log(errorObject)
	logger.log("info", "Entering Response :: Error response");
	var responseObject = null;
	try {
		
        if(typeof errorObject.errorMsg !=='undefined' && errorObject.errorMsg !=''){
            response.writeHead(errorObject.statusCd, {
			
		});
            response.end(errorObject.errorMsg);
        }else{
            response.writeHead(errorObject.statusCd, {
			"Content-Type" : constants.APPLN_JSON
		});
            responseObject = {
                error_code : errorObject.errorCd,
                msg : errorObject.errorMsg ? errorObject.errorMsg : ''
            };		
            response.end(JSON.stringify(responseObject));
        }

		

	} finally {
		logger.log("info", "Exiting Response :: Error response");
		responseObject = null;
	}
};
exports.error_msg = function(errorObject, response) {
	logger.log("info", "Entering Response :: Error response with Message");
	var responseObject = null;
	try {
		response.writeHead(errorObject.statusCd, {
			"Content-Type" : constants.APPLN_JSON
		});

		responseObject = {
			error_code : errorObject.errorCd,
			error_msg : errorObject.errorMsg
		};		
		response.end(JSON.stringify(responseObject));

	} finally {
		logger.log("info", "Exiting Response :: Error response with Message");
		responseObject = null;
	}
};

exports.success = function(data, response) {
	logger.log("info", "Entering  Response :: Success response");
	var statusCd = null;
	try {
		statusCd = errorConstants.STATUS_200;		
		logger.log("debug", "data:: %s",  JSON.stringify(data));
		response.writeHead(200, {
			"Content-Type" : constants.APPLN_JSON
		});
		response.end(JSON.stringify(data));
	} finally {
		statusCd = null;
		logger.log("info", "Exiting Response :: Success response");
	}
};
