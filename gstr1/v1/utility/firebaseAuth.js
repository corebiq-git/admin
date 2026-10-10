'use strict';

var tenantContext = require('./tenantContext');
var authRequired = process.env.REQUIRE_FIREBASE_AUTH === 'true';
var firebaseAdmin = null;
exports.required = authRequired;

if (authRequired) {
    var projectId = process.env.FIREBASE_PROJECT_ID;
    if (!projectId) {
        throw new Error('FIREBASE_PROJECT_ID is required when REQUIRE_FIREBASE_AUTH=true.');
    }

    var firebaseAdminApp = require('firebase-admin/app');
    var firebaseAdminAuth = require('firebase-admin/auth');
    var credential;
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        var serviceAccount;
        try {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
        } catch (error) {
            throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON must contain valid JSON.');
        }
        credential = firebaseAdminApp.cert(serviceAccount);
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        credential = firebaseAdminApp.applicationDefault();
    } else {
        throw new Error('Set FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS.');
    }

    var firebaseApp = firebaseAdminApp.initializeApp({
        credential: credential,
        projectId: projectId
    });
    firebaseAdmin = firebaseAdminAuth.getAuth(firebaseApp);
}

function isPublicRequest(req) {
    if (req.method === 'GET' &&
            (req.path === '/' || req.path === '/health' ||
             req.path === '/versionCheck' || req.path === '/b2clConstants' ||
             req.path === '/firebase-config.js')) {
        return true;
    }

    return req.method === 'GET' &&
        /^\/(uiassets|pages|images|lang|data|fonts|stylesheets)\//.test(req.path);
}

exports.middleware = function (req, res, next) {
    if (isPublicRequest(req) || !authRequired) {
        return next();
    }

    var authorization = req.get('Authorization') || '';
    var match = authorization.match(/^Bearer ([^\s]+)$/);
    if (!match) {
        return res.status(401).json({ error: 'authentication_required' });
    }

    firebaseAdmin.verifyIdToken(match[1]).then(function (decodedToken) {
        if (!decodedToken.uid || !/^[A-Za-z0-9_-]+$/.test(decodedToken.uid)) {
            return res.status(401).json({ error: 'invalid_identity' });
        }

        req.authenticatedUser = {
            uid: decodedToken.uid,
            email: decodedToken.email || null
        };
        tenantContext.run(decodedToken.uid, next);
    }, function () {
        res.status(401).json({ error: 'invalid_or_expired_token' });
    });
};
