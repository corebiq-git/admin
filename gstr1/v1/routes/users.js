'use strict';

var express = require('express');
var path = require('path');
var router = express.Router();
var publicRequest = /^\/(?:uiassets|pages|images|lang|data|fonts|stylesheets)\//;

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/local-tool.html'));
});

router.get('/health', function (req, res) {
    res.status(200).send('OK');
});

router.use(function (req, res, next) {
    if (req.method === 'GET' &&
            (publicRequest.test(req.path) ||
             req.path === '/local-tool.html' ||
             req.path === '/manifest.webmanifest' ||
             req.path === '/service-worker.js')) {
        return next();
    }

    res.status(410).json({
        error: 'server_processing_disabled',
        message: 'Return data is processed and stored on your device only.'
    });
});

module.exports = router;
