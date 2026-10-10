'use strict';

var AsyncLocalStorage = require('async_hooks').AsyncLocalStorage;
var tenantStorage = new AsyncLocalStorage();

exports.run = function (tenantId, callback) {
    tenantStorage.run(tenantId, callback);
};

exports.current = function () {
    return tenantStorage.getStore();
};

exports.cacheKey = function (key) {
    var tenantId = tenantStorage.getStore();
    return tenantId ? tenantId + ':' + key : key;
};
