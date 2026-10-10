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
var constants = require('./utility/constants');
var errorConstant = require('./utility/errorconstants');
var users = require('./routes/users');
var app = express();
var basePath = process.env.BASE_PATH || '';

if (basePath && basePath !== '/') {
    var baseSegments = basePath.split('/').filter(function (segment) {
        return segment.length > 0;
    });
    if (!baseSegments.length || baseSegments.some(function (segment) {
        return !/^[A-Za-z0-9_-]+$/.test(segment);
    })) {
        throw new Error('BASE_PATH must contain only URL-safe path segments.');
    }
    basePath = '/' + baseSegments.join('/');
} else {
    basePath = '';
}

app.set('basePath', basePath);
app.use(function(req, res, next) {
    res.setHeader('Cache-Control', 'no-store');
    next();
});

app.use(basePath || '/', users);
app.use(basePath || '/', express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || +constants.NODE_PORT);
app.use('*', function(req, res) {
    res.status(errorConstant.STATUS_404).send(errorConstant.BAD_URL);
});
http.createServer(app).listen(app.get('port'), function() {
    var logger = require('./utility/logger').logger;
    logger.log('info', 'Started COREBIQ GSTR1 local tool server on port %s', app.get('port'));
});
