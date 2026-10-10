'use strict';

var fs = require('fs');
var path = require('path');
var tenantContext = require('./tenantContext');

var publicRoot = path.resolve(__dirname, '..', 'public');
var tenantDataRoot = path.resolve(
    process.env.DATA_ROOT || path.resolve(__dirname, '..', 'data', 'tenants')
);
var tenantDirectories = [
    'userData',
    'upload',
    'download',
    'error',
    'generatedFile',
    'uploadXML'
];
var installed = false;

function remap(value) {
    if (typeof value !== 'string') {
        return value;
    }

    var tenantId = tenantContext.current();
    if (!tenantId) {
        return value;
    }

    var absolutePath = path.resolve(value);
    for (var i = 0; i < tenantDirectories.length; i += 1) {
        var protectedRoot = path.join(publicRoot, tenantDirectories[i]);
        if (absolutePath === protectedRoot ||
                absolutePath.indexOf(protectedRoot + path.sep) === 0) {
            var relativePath = path.relative(publicRoot, absolutePath);
            return path.join(tenantDataRoot, tenantId, relativePath);
        }
    }

    return value;
}

exports.install = function () {
    if (installed) {
        return;
    }
    installed = true;

    var pathMethods = [
        'access', 'accessSync',
        'appendFile', 'appendFileSync',
        'chmod', 'chmodSync',
        'chown', 'chownSync',
        'createReadStream', 'createWriteStream',
        'exists', 'existsSync',
        'lstat', 'lstatSync',
        'mkdir', 'mkdirSync',
        'open', 'openSync',
        'readdir', 'readdirSync',
        'readFile', 'readFileSync',
        'rm', 'rmSync',
        'realpath', 'realpathSync',
        'rmdir', 'rmdirSync',
        'stat', 'statSync',
        'truncate', 'truncateSync',
        'unlink', 'unlinkSync',
        'utimes', 'utimesSync',
        'writeFile', 'writeFileSync'
    ];
    var nativeRealpathSync = fs.realpathSync && fs.realpathSync.native;

    pathMethods.forEach(function (methodName) {
        var original = fs[methodName];
        if (typeof original !== 'function') {
            return;
        }

        fs[methodName] = function () {
            var args = Array.prototype.slice.call(arguments);
            args[0] = remap(args[0]);
            return original.apply(fs, args);
        };
    });

    if (nativeRealpathSync) {
        fs.realpathSync.native = function (filePath) {
            var args = Array.prototype.slice.call(arguments);
            args[0] = remap(args[0]);
            return nativeRealpathSync.apply(fs, args);
        };
    }

    var promiseFs = fs.promises;
    if (promiseFs) {
        pathMethods.forEach(function (methodName) {
            var original = promiseFs[methodName];
            if (typeof original !== 'function') {
                return;
            }
            promiseFs[methodName] = function () {
                var args = Array.prototype.slice.call(arguments);
                args[0] = remap(args[0]);
                return original.apply(promiseFs, args);
            };
        });

        ['rename', 'copyFile', 'link'].forEach(function (methodName) {
            var original = promiseFs[methodName];
            if (typeof original !== 'function') {
                return;
            }
            promiseFs[methodName] = function () {
                var args = Array.prototype.slice.call(arguments);
                args[0] = remap(args[0]);
                args[1] = remap(args[1]);
                return original.apply(promiseFs, args);
            };
        });
    }

    ['rename', 'renameSync', 'copyFile', 'copyFileSync', 'link', 'linkSync'].forEach(function (methodName) {
        var original = fs[methodName];
        if (typeof original !== 'function') {
            return;
        }

        fs[methodName] = function () {
            var args = Array.prototype.slice.call(arguments);
            args[0] = remap(args[0]);
            args[1] = remap(args[1]);
            return original.apply(fs, args);
        };
    });
};
