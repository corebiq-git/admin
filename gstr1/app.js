'use strict';

var express = require('express');
var path = require('path');
var app = express();
var basePath = process.env.BASE_PATH || '';

if (basePath && basePath !== '/') {
    var segments = basePath.split('/').filter(Boolean);
    if (!segments.length || segments.some(function (segment) {
        return !/^[A-Za-z0-9_-]+$/.test(segment);
    })) {
        throw new Error('BASE_PATH must contain only URL-safe path segments.');
    }
    basePath = '/' + segments.join('/');
} else {
    basePath = '';
}

var mountPath = basePath || '/';
app.disable('x-powered-by');
app.use(function (req, res, next) {
    res.setHeader('Cache-Control', 'no-store');
    next();
});

app.get((basePath || '') + '/health', function (req, res) {
    res.status(200).send('OK');
});

app.use(mountPath, function (req, res, next) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        return res.status(410).json({
            error: 'server_processing_disabled',
            message: 'GSTR-1 return data is handled and stored on this device only.'
        });
    }
    next();
});

app.use(mountPath, express.static(path.join(__dirname, 'public'), {
    index: 'index.html',
    fallthrough: true
}));

app.use(function (req, res) {
    res.sendStatus(404);
});

if (require.main === module) {
    var port = Number(process.env.PORT || 3000);
    app.listen(port, '0.0.0.0', function () {
        console.log('COREBIQ GSTR-1 web app listening on port ' + port);
    });
}

module.exports = app;
