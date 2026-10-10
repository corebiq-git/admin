/*
author @ Shiwali Srivastava
developed by GSTN
*/

/**
 *  @author:   Shiwali Srivastava
 *  @created:   Sep 2016
 *  @description: Offline utility
 *  @copyright: (c) Copyright by Infosys technologies
 *  Revision 1.5
 *  Last Updated: Sri Harsha, Dec 19 2017
 **/

'use strict';
var express = require('express');
var path = require('path');
var http = require('http');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var tenantFilesystem = require('./utility/tenantFilesystem');
tenantFilesystem.install();
var constants = require('./utility/constants');
var errorConstant = require('./utility/errorconstants');
var bodyParser = require('body-parser');
var users = require('./routes/users');
var app = express();
const NodeCache = require( "node-cache" );
var async = require('async');
app.set('myCache', new NodeCache( { stdTTL: 200, checkperiod: 120 } )); 
async.waterfall([
		function(callback) {
            
//        app.use(bodyParser.json( ));
//        app.use(bodyParser.urlencoded({  extended: false}));
            
        app.use(bodyParser.json({limit: '50mb'}));
        app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));



		app.use(cookieParser())
        
		app.use('/', users);
		app.use(express.static(path.join(__dirname, 'public')));
        app.set('port', process.env.PORT || +constants.NODE_PORT); 
		app.set('views', path.join(__dirname, 'views'));
		app.set('view engine', 'jade');
        app.use('*', function(req, res) {
            res.status(errorConstant.STATUS_404).send(
                errorConstant.BAD_URL);
            res.end();
        });  
        callback(null, true);
		 }
], function(error, response) {
	var log = require('./utility/logger'), logger = log.logger;
    if (error) {    	
        logger.log("error","Error while starting server. Please check error log %s" , error.message)        
    } else {	
		process.on('uncaughtException', function (e) {
    			logger.log("error","UnCaught Exception :: ", e);
			}
			)
        http.createServer(app).listen(
            app.get('port'),
            function() {
			logger.log("info","Started COREBIQ GSTR1 TOOL server, listening on port :: %s , :: %s" ,app.get('port'), new Date().getTime(), new Date().toString());
			 
            	logger.level = constants.LOG_LVL_ERROR;
            });
    }


})



