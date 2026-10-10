/*jslint browser: true, sloppy:true, nomen: true, node: true, bitwise: true, regexp: true*/
/*global $, jQuery, angular, myApp, regex, transctrl, accessctrl, translationSrv, RouteProviderConfig, moment, WebSocket, Uint8Array, FileReader, MediaStreamTrack, console, getComputedStyle, FormData*/

/**
 *  @author:    Sri Harsha Samineni
 *  @created:   Sep 2016
 *  @description: Commonly used angular factories, services, modules, and functionality for FO User services
 *  @copyright: (c) Copyright by Infosys technologies
 *  Revision 1.2 
 *  Last Updated: Prakash Kaphle, Mar 28 2019
 **/
"use strict";
if (!myApp) {
    var myApp = angular.module("myApp", ['ngRoute', 'LocalStorageModule', 'ngProgress']);
    var RouteProviderConfig = function ($routeProvider, $locationProvider) {

    }
}
myApp.controller("footerCtrl", ["$scope", "$rootScope", function ($scope, $rootScope) {
    $rootScope.$on("udata", function (event, mass) {
        if (mass && mass.udata) {
            $scope.udata = mass.udata;
            $scope.expanded = true;
        }
    });
    $scope.expanded = false;
    $scope.servers = $().getConstant('servers');
    $scope.fexpand = function () {
        $scope.expanded = !$scope.expanded;
    };
}]).controller("headerCtrl", ["$scope", "ajax", "$timeout", "shareData", "$rootScope", function ($scope, ajax, $timeout, shareData, $rootScope) {
    $scope.udata = undefined;
    $scope.servers = $().getServers();
    ajax.get("/services/api/ustatus").then(function (resp) {
        if (resp && Object.keys(resp).length > 0) {
            $scope.udata = resp;
            shareData.udata = $scope.udata;
            $rootScope.$emit("udata", {
                "udata": $scope.udata
            });
        }
    }, function (err) {

    });

}]);
//RouteProviderConfig.$inject = ['$routeProvider', '$locationProvider'];
//myApp.config(RouteProviderConfig);

myApp.config(['$httpProvider', '$compileProvider', 'localStorageServiceProvider', function ($httpProvider, $compileProvider, localStorageServiceProvider) {
    $httpProvider.interceptors.push('httpTimeout');
    $httpProvider.interceptors.push('httpInterceptor');
    $compileProvider.debugInfoEnabled(false);
    localStorageServiceProvider.setPrefix('ls');
}]);
/***** env setup****/
myApp.provider('envService', function () {
    this.environment = 'development';
    this.set = function (environment) {
        this.environment = environment;
    };

    this.get = function () {
        return this.environment;
    };

    this.is = function (environment) {
        return (environment === this.environment);
    };
    this.$get = function () {
        return this;
    };
});
myApp.config(["envServiceProvider", function (envServiceProvider) {
    envServiceProvider.set('development');
}]);
myApp.config(["$provide", "$logProvider", "envServiceProvider", function ($provide, $logProvider, envServiceProvider) {

    $provide.decorator('$http', ["$delegate", "$q", function ($delegate, $q) {
        var pendingRequests = {},
            $http = $delegate,
            $duplicateRequestsFilter;

        function hash(str) {
            var h = 0,
                strlen = str.length,
                i, n;
            if (strlen === 0) {
                return h;
            }
            for (i = 0; i < strlen; i = i + 1) {
                n = str.charCodeAt(i);
                h = ((h << 5) - h) + n;
                h = h & h;
            }
            return h >>> 0;
        }

        function getRequestIdentifier(config) {
            var str = config.method + config.url;
            if (config.params && typeof config.params === 'object') {
                str += angular.toJson(config.params);
            }
            if (config.data && typeof config.data === 'object') {
                str += angular.toJson(config.data);
            }
            return hash(str);
        }

        $duplicateRequestsFilter = function (config) {

            //Ignore for this request?
            if (config.ignoreDuplicateRequest) {
                return $http(config);
            }

            //Get unique request identifier
            var identifier = getRequestIdentifier(config);

            //Check if such a request is pending already
            if (pendingRequests[identifier]) {
                if (config.rejectDuplicateRequest) {
                    return $q.reject({
                        data: '',
                        headers: {},
                        status: config.rejectDuplicateStatusCode || 400,
                        config: config
                    });
                }
                return pendingRequests[identifier];
            }

            //Create promise using $http and make sure it's reset when resolved
            pendingRequests[identifier] = $http(config)['finally'](function () {
                delete pendingRequests[identifier];
            });

            //Return promise
            return pendingRequests[identifier];
        };

        //Map rest of methods
        Object.keys($http).filter(function (key) {
            return (typeof $http[key] === 'function');
        }).forEach(function (key) {
            $duplicateRequestsFilter[key] = $http[key];
        });

        //Return it
        return $duplicateRequestsFilter;
    }]);

    if (envServiceProvider.get() === 'production') {
        $logProvider.debugEnabled(false);
    }

    if (envServiceProvider.get() === 'development') {
        $logProvider.debugEnabled(true);
    }

    $provide.decorator('$log', ["$delegate", function ($delegate) {
        var debugFn = $delegate.debug,
            warnFn = $delegate.warn,
            errFn = $delegate.error,
            infoFn = $delegate.info,
            logFn = $delegate.log,
            supplant = function (template, values, pattern) {
                pattern = pattern || /\{([^\{\}]*)\}/g;
                return template.replace(pattern, function (a, b) {
                    var p = b.split('.'),
                        r = values,
                        s;
                    try {
                        for (s in p) {
                            if (p.hasOwnProperty(s)) {
                                r = r[p[s]];
                            }
                        }
                    } catch (e) {
                        r = e;
                    }
                    return (typeof r === 'string' || typeof r === 'number') ? r : a;
                });
            };

        $delegate.debug = function () {
            var args = [].slice.call(arguments),
                now = moment().format('DD-MM-YYYY hh:mm:ss A');
            if (typeof args[0] === 'object') {
                args[1] = now;
            } else {
                args[0] = supplant("{0} - {1}", [now, args[0]]);
            }
            if ($logProvider.debugEnabled()) {
                debugFn.apply(null, args);
            }
        };
        $delegate.warn = function () {
            var args = [].slice.call(arguments),
                now = moment().format('DD-MM-YYYY hh:mm:ss A');
            if (typeof args[0] === 'object') {
                args[1] = now;
            } else {
                args[0] = supplant("{0} - {1}", [now, args[0]]);
            }
            if ($logProvider.debugEnabled()) {
                warnFn.apply(null, args);
            }
        };
        $delegate.error = function () {
            var args = [].slice.call(arguments),
                now = moment().format('DD-MM-YYYY hh:mm:ss A');
            if (typeof args[0] === 'object') {
                args[1] = now;
            } else {
                args[0] = supplant("{0} - {1}", [now, args[0]]);
            }
            if ($logProvider.debugEnabled()) {
                errFn.apply(null, args);
            }
        };
        $delegate.log = function () {
            var args = [].slice.call(arguments),
                now = moment().format('DD-MM-YYYY hh:mm:ss A');
            if (typeof args[0] === 'object') {
                args[1] = now;
            } else {
                args[0] = supplant("{0} - {1}", [now, args[0]]);
            }
            if ($logProvider.debugEnabled()) {
                logFn.apply(null, args);
            }
        };
        $delegate.info = function () {
            var args = [].slice.call(arguments),
                now = moment().format('DD-MM-YYYY hh:mm:ss A');
            if (typeof args[0] === 'object') {
                args[1] = now;
            } else {
                args[0] = supplant("{0} - {1}", [now, args[0]]);
            }
            if ($logProvider.debugEnabled()) {
                infoFn.apply(null, args);
            }
        };
        return $delegate;
    }]);
}]);

myApp.factory("shareData", function () {
    return {};
});

myApp.service('cache', ['localStorageService', function (localStorageService) {
    if (document.all && !window.localStorage) {
        window.localStorage = {};
        window.localStorage.removeItem = function () { };
    }

    //this.ttl = 3 * 60 * 60; // 3 hours by default
    this.ttl = $().getConstant("LCACHE_MIN_TIME");
    this.set = function (key, value, expire) {
        try {
            localStorageService.set(key, {
                data: value,
                timestamp: new Date().getTime(),
                ttl: (expire || this.ttl) * 1000
            });
        } catch (err) {
            console.log("Cache Quota exceeded");
        }

    };
    this.get = function (key) {
        var item = localStorageService.get(key);
        if (item === null || item === undefined) {
            return [];
        }
        if (item) {
            if (Object.keys(item).length < 3) {
                return [];
            }
            if (new Date().getTime() > (item.timestamp + item.ttl)) {
                localStorageService.remove(key);
                return [];
            }
            return item.data;
        }
        return [];
    };
    this.remove = function (key) {
        localStorageService.remove(key);
    };
    this.removeExpired = function () {
        $.map(localStorageService.keys(), function (key) {
            key = localStorageService.get(key);
            if (key != null && (new Date().getTime() > (key.timestamp + key.ttl))) {
                localStorageService.remove(key);
            }
        });
    };
    this.clearAll = function () {
        localStorageService.clearAll();
    };
}]);

myApp.service("validations", function () {
    this.formats = {
        //added reg-ex by prakash
        taxableVal: /^(\d{0,11})(\.\d{0,2})?$/,
        noteType: /^(C|D)$/,
        InvNoteNumber: /^[a-zA-Z0-9-\/]{1,16}$/,
        diffPercentage: /^(100|65)$/,
        InvNoteValue: /^(\d{0,13})(\.\d{0,2})?$/,
        urType: /^(B2CL|EXPWP|EXPWOP|)$/,
        rates: /^(0|0.25|0.1|0.10|1|1.5|1.50|3|5|6|7.5|7.50|12|18|28|40)$/,
        cessAmount: /^(\d{0,11})(\.\d{0,2})?$/,
        reverseChrge: /^(Y|N)$/,
        //prakash changes end
        tmpgstin: /^[a-zA-Z0-9]{6,25}$/,
        pan: /^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/,
        tan: /^[a-zA-Z]{4}[0-9]{5}[a-zA-Z]{1}$/,
        mobile: /^[1-9]{1}[0-9]{9}$/,
        tlphno: /^[1-9]{1}[0-9]{9}$/,
        email: /^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/,
        inum: /^[a-zA-Z0-9\/\-]*$/,
        captcha: /^([0-9]){6}$/,
        passport: /^[A-PR-WYa-pr-wy][1-9]\d\s?\d{4}[1-9]$/,
        piocard: /^[pP]\d{7}$/,
        gstin: /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Zz1-9A-Ja-j]{1}[0-9a-zA-Z]{1}/,
        tdsnormalgstin: /([0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Zz1-9A-Ja-j]{1}[0-9a-zA-Z]{1})|([0-9]{2}[a-zA-Z]{4}[a-zA-Z0-9]{1}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[D]{1}[0-9a-zA-Z]{1})/,
        uin: /[0-9]{4}[A-Z]{3}[0-9]{5}[UO]{1}[N][A-Z0-9]{1}/,
        nrid: /[0-9]{4}[a-zA-Z]{3}[0-9]{5}[N][R][0-9a-zA-Z]{1}/,
        tdsid: /[0-9]{2}[a-zA-Z]{4}[a-zA-Z0-9]{1}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[D]{1}[0-9a-zA-Z]{1}/,
        provisional: /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9a-zA-Z]{1}/ | /^[0-9]{4}[A][R][0-9]{7}[Z]{1}[0-9]{1}/ | /^[0-9]{2}[a-zA-Z]{4}[0-9]{5}[a-zA-Z]{1}[0-9]{1}[Z]{1}[0-9]{1}/ | /^[0-9]{4}[a-zA-Z]{3}[0-9]{5}[0-9]{1}[Z]{1}[0-9]{1}/,
        number: /^[0-9]*$/,
        fo_otp: /^[0-9]+$/,
        pincode: /^[0-9]{6}$/,
        zipcode: /^[A-Za-z0-9]{1,60}$/,
        aadhar: /\d{12}$/,
        fo_user: /^[a-zA-Z][a-zA-Z0-9_\.\-]*$/,
        fo_password: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\@\!\#\%\^\$\&\`\*\-\_\+])(?=.*[a-zA-Z0-9\@\!\#\%\^\$\&\`\*\-\_\+]*$).{8,15}/,
        fo_secans: /^[a-zA-Z0-9@._*\/\-]+(\s+[a-zA-Z0-9@._*\/\-\s]+)*$/,
        otp: /^[0-9]{6}$/,
        svat: /^[A-Za-z0-9\/]{6,25}$/,
        othr: /^[A-Za-z0-9\/]{6,25}$/,
        cst: /^[A-Za-z0-9]{6,25}$/,
        entax: /^[A-Za-z0-9]{6,25}$/,
        etax: /^[A-Za-z0-9]{6,25}$/,
        et: /^[A-Za-z0-9]{6,25}$/,
        ent: /^[A-Za-z0-9]{6,25}$/,
        hlt: /^[A-Za-z0-9]{6,25}$/,
        hltax: /^[A-Za-z0-9]{6,25}$/,
        seact: /^[A-Za-z0-9]{6,25}$/,
        exact: /^[A-Za-z0-9]{6,25}$/,
        llpin: /^[A-Za-z0-9]{6,25}$/,
        ce: /^[A-Za-z0-9]{6,25}$/,
        svtax: /^[A-Za-z0-9]{6,25}$/,
        cin: /^[A-Za-z0-9\-]{6,25}$/,
        llp: /^[A-Za-z0-9\-]{6,25}$/,
        iec: /^[A-Za-z0-9]{6,25}$/,
        mnt: /^[A-Za-z0-9]{6,25}$/,
        globalpassport: /^[A-Za-z0-9 -\/]{8,15}$/,
        trn: /[0-9]{12}(T|t)(R|r)(N|n)$/,

        name: /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/,
        buidno: /^[a-zA-Z0-9 \/_\-\,\.]{1,60}$/,
        floorno: /^[a-zA-Z0-9\-\\\/\.\, ]{1,60}$/,
        faxno: /^[0-9]{11,16}$/,
        tName: /^[a-zA-Z0-9\_&'\-\.\/\,()?@!#%$~*;+= ]{1,99}$/,
        reason: /^[a-zA-Z0-9\_\-\/.,&%$ ]{1,500}$/,
        din: /^[0-9]{8}$/,
        acno: /^[A-Za-z0-9]{6,20}$/,

        pwdtooltip_user: /^([a-zA-Z0-9\_\-\.]){8,15}$/,
        pwdtooltip_uppercase: /[A-Z]/,
        pwdtooltip_lowercase: /[a-z]/,
        pwdtooltip_num: /[0-9]/,
        pwdtooltip_symbol: /[\@\!\#\%\^\$\&\`\*\-\_\+]+/,
        pwdtooltip_pwd: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*^[a-zA-Z0-9\@\!\#\%\^\$\&\`\*\-\_\+]*$).{8,15}/,
        latlng: /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/,
        quantity: /^(?=.*[0-9])([-]?[0-9]{0,15}|[-]?[0-9]{0,15}\.{1}[0-9]{0,2})$/,
        itcqty: /^([0-9]{0,15}|[0-9]{0,15}\.{1}[0-9]{0,2})$/,
        uqc: /^[a-zA-Z]{0,30}$/,
        desc: /^[a-zA-Z0-9\/\-/\s/g]*$/,
        etin: /^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[C]{1}[0-9a-zA-Z]{1}$/,
        nrtp: /^[0-9]{4}[a-zA-Z]{3}[0-9]{5}[N][R][0-9a-zA-Z]{1}$/,
        quantityr9: /^([-]?[0-9]{0,13}|[-]?[0-9]{0,13}\.{1}[0-9]{0,2})$/,
        //Master gstin
       tdsregex : /^[0-9]{2}[a-zA-Z]{4}[a-zA-Z0-9]{1}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[DK]{1}[0-9a-zA-Z]{1}$/,
       tcsregex : /^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[C]{1}[0-9a-zA-Z]{1}$/,
       oidarregex : /^[9][9][0-9]{2}[a-zA-Z]{3}[0-9]{5}[O][S][0-9a-zA-Z]{1}$/,
       nriregex : /^[0-9]{4}[a-zA-Z]{3}[0-9]{5}[N][R][0-9a-zA-Z]{1}$/,
       unibodyregex : /^[0-9]{4}[A-Z]{3}[0-9]{5}[UO]{1}[N][A-Z0-9]{1}$/,
       invoiceregex : /^(?=.{1,16}$)([/\-0]*[a-zA-Z0-9/\-]*[a-zA-Z1-9]+[a-zA-Z0-9/\-]*)$/,
     };
    this.maxlength = {
        pan: "10",
        tan: "10",
        mobile: "10",
        tlphno: "16",
        email: "255",
        captcha: "6",
        passport: "",
        piocard: "7",
        gstin: "15",
        number: "",
        fo_otp: "",
        pincode: "6",
        aadhar: "12",
        fo_user: "",
        fo_password: "15",
        fo_secans: "",
        svat: "25",
        othr: "25",
        cst: "25",
        etax: "25",
        entax: "25",
        et: "25",
        ent: "25",
        hlt: "25",
        ce: "25",
        svtax: "25",
        cin: "25",
        llp: "25",
        iec: "25",
        mnt: "25",
        globalpassport: "25",
        trn: "15",
        name: "60",
        buidno: "60",
        floorno: "60",
        faxno: "16",
        tName: "99",
        reason: "500",
        din: "8",
        acno: "20",
        rate: "6"
    };
    this.messages = {
        pan: "ERR_PAN",
        tan: "ERR_TAN",
        mobile: "ERR_MBL_FRMT",
        tlphno: "ERR_INV_TELE",
        email: "ERR_EMAIL_FRMT",
        captcha: "ERR_CAPTCHA_FRMT",
        passport: "Invalid Passport Number",
        piocard: "Invalid PIO Card Number",
        gstin: "Invalid GSTIN",
        tmpgstin: "Invalid entry, Please enter 6-25 alphanumeric registration no.",
        number: "Invalid Number, please enter digits only",
        pincode: "Enter valid PIN code",
        aadhar: "Invalid aadhar, Please enter 12 digit aadhar number",
        svat: "Invalid entry, Please enter 6-25 alphanumeric state VAT registration number",
        cst: "Invalid entry, Please enter 6-25 character central sales tax number",
        etax: "Invalid entry, Please enter 6-25 character central sales tax number",
        et: "Invalid entry, Please enter 6-25 alphanumeric registration no.",
        entax: "Invalid entry, Please enter 6-25 alphanumeric registration no.",
        ent: "Invalid entry, Please enter 6-25 alphanumeric registration no.",
        hlt: "Invalid entry, Please enter 6-25 alphanumeric registration no.",
        hltax: "Invalid entry, Please enter 6-25 alphanumeric registration no.",
        seact: "Invalid entry, Please enter 6-25 alphanumeric registration no.",
        exact: "Invalid entry, Please enter 6-25 alphanumeric registration no.",
        llpin: "Invalid entry, Please enter 6-25 alphanumeric Identification no.",
        ce: "Invalid entry, Please enter 6-25 character alphanumneic central excise number",
        svtax: "Invalid entry, Please enter 6-25 character alphanumeric service tax registration number",
        cin: "Invalid entry, Please enter 6-25 character alphanumeric Corporate identity number",
        llp: "Invalid entry, Please enter 6-25 character alphanumeric LLP registration number",
        iec: "Invalid entry, Please enter 6-25 character alphanumeric Importer/Exporter code number",
        mnt: "Invalid entry, Please enter 6-25 alphanumeric registration no.",
        globalpassport: "ERR_PASS_NUM",
        name: "",
        buidno: "",
        floorno: "",
        faxno: "",
        tName: "",
        reason: "",
        din: "ERR_INV_DIN",
        acno: ""
    };
    this.pan = function (value) {
        return this.formats.pan.test(value);
    };
    this.acno = function (value) {
        return this.formats.acno.test(value);
    };
    this.din = function (value) {
        return this.formats.din.test(value);
    };
    this.faxno = function (value) {
        return this.formats.faxno.test(value);
    };
    this.mobile = function (value) {
        return this.formats.mobile.test(value);
    };
    this.captcha = function (value) {
        return this.formats.captcha.test(value);
    };
    this.cin = function (value) {
        return this.formats.cin.test(value);
    };
    this.iec = function (value) {
        return this.formats.iec.test(value);
    };
    this.svat = function (value) {
        return this.formats.svat.test(value);
    };
    this.ce = function (value) {
        return this.formats.ce.test(value);
    };
    this.svtax = function (value) {
        return this.formats.svtax.test(value);
    };
    this.svat = function (value) {
        return this.formats.svat.test(value);
    };
    this.cst = function (value) {
        return this.formats.cst.test(value);
    };
    this.email = function (value) {
        return this.formats.email.test(value);
    };
    this.name = function (value) {
        return this.formats.name.test(value);
    };
    this.buidno = function (value) {
        return this.formats.buidno.test(value);
    };
    this.floorno = function (value) {
        return this.formats.floorno.test(value);
    };
    this.checkGstn = function (gst) {

        var factor = 2,
            sum = 0,
            checkCodePoint = 0,
            i, j, digit, mod, codePoint, cpChars, inputChars;
        cpChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        inputChars = gst.trim().toUpperCase();

        mod = cpChars.length;
        for (i = inputChars.length - 1; i >= 0; i = i - 1) {
            codePoint = -1;
            for (j = 0; j < cpChars.length; j = j + 1) {
                if (cpChars[j] === inputChars[i]) {
                    codePoint = j;
                }
            }

            digit = factor * codePoint;
            factor = (factor === 2) ? 1 : 2;
            digit = (digit / mod) + (digit % mod);
            sum += Math.floor(digit);
        }
        checkCodePoint = ((mod - (sum % mod)) % mod);

        return gst + cpChars[checkCodePoint];
    };
    this.gstin = function (gst) {
        if (this.formats.gstin.test(gst)) {
            var substrgst = gst.substr(0, 14);
            if (gst === this.checkGstn(substrgst)) {
                return true;
            }
        }
        return false;
    };
    this.tdsregex = function (gst) {
        if (this.formats.tdsregex.test(gst)) {
            var substrgst = gst.substr(0, 14);
            if (gst === this.checkGstn(substrgst)) {
                return true;
            }
        }
        return false;
    };
    this.tcsregex = function (gst) {
        if (this.formats.tcsregex.test(gst)) {
            var substrgst = gst.substr(0, 14);
            if (gst === this.checkGstn(substrgst)) {
                return true;
            }
        }
        return false;
    };
    
    this.oidarregex = function (gst) {
        if (this.formats.oidarregex.test(gst)) {
            var substrgst = gst.substr(0, 14);
            if (gst === this.checkGstn(substrgst)) {
                return true;
            }
        }
        return false;
    };
    
    this.nriregex = function (gst) {
        if (this.formats.nriregex.test(gst)) {
            var substrgst = gst.substr(0, 14);
            if (gst === this.checkGstn(substrgst)) {
                return true;
            }
        }
        return false;
    };
    
    this.unibodyregex = function (gst) {
        if (this.formats.unibodyregex.test(gst)) {
            var substrgst = gst.substr(0, 14);
            if (gst === this.checkGstn(substrgst)) {
                return true;
            }
        }
        return false;
    };

    this.uin = function (uin) {
        if (this.formats.uin.test(uin)) {
            var substrgst = uin.substr(0, 14);
            if (uin === this.checkGstn(substrgst)) {
                return true;
            }
        }
        return false;
    };
    this.tdsid = function (tdsid) {
        if (this.formats.tdsid.test(tdsid)) {
            var substrgst = tdsid.substr(0, 14);
            if (tdsid === this.checkGstn(substrgst)) {
                return true;
            }
        }
        return false;
    };
    this.nrtp = function (nrtp) {
        if (this.formats.nrtp.test(nrtp)) {
            var substrgst = nrtp.substr(0, 14);
            if (nrtp === this.checkGstn(substrgst)) {
                return true;
            }
        }
        return false;
    };

    this.isNumber = function (val) {
        return this.formats.number.test(val);
    };
    this.invArray = function (array) {
        if (Object.prototype.toString.call(array) === "[object Number]") {
            array = String(array);
        }

        if (Object.prototype.toString.call(array) === "[object String]") {
            array = array.split("").map(Number);
        }

        return array.reverse();
    };

    this.aadhar = function (value) {
        if (!this.formats.aadhar.test(value)) {
            return false;
        }

        var d = [
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
            [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
            [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
            [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
            [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
            [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
            [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
            [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
            [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
        ],
            p = [
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
                [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
                [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
                [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
                [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
                [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
                [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
            ],
            inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9],
            c = 0,
            invertedArray = this.invArray(value),
            i;

        for (i = 0; i < invertedArray.length; i = i + 1) {
            c = d[c][p[(i % 8)][invertedArray[i]]];
        }

        return (c === 0);
    };

});
myApp.service('ajax', ['$http', '$q', '$rootScope', 'httpLoader', "$route", function ($http, $q, $rootScope, httpLoader, $route) {
    this.isAuthorized = function () {
        $().keepalive();
    };
    this.post = function (url, data, headers, beforeSend, complete, ignoreDuplicate) {
        var deferred = $q.defer(),
            ajax = this;
        $http({
            url: url,
            method: "POST",
            data: data,
            headers: headers,
            beforeSend: beforeSend,
            complete: complete,
            rejectDuplicateRequest: true,
            ignoreDuplicateRequest: ignoreDuplicate
        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (error, status) {
            deferred.reject({
                "code": error.status,
                "msg": "System Error: Unable to load data"
            });
        })['finally'](function () {
            $().resetAlive();
        });
        deferred.promise.cancel = function () {
            deferred.reject('CANCELLED')
        };
        return deferred.promise;
    };

    this.get = function (url, data, headers, beforeSend, complete, ignoreDuplicate) {
        var deferred = $q.defer(),
            ajax = this;
        $http({
            url: url,
            method: "GET",
            data: data,
            params: data,
            headers: headers,
            beforeSend: beforeSend,
            complete: complete,
            rejectDuplicateRequest: true,
            ignoreDuplicateRequest: ignoreDuplicate
        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (error, status) {
            deferred.reject({
                "code": error.status,
                "msg": "System Error: Unable to load data"
            });
            if (ajax.pendingReq() === 0) {
                setTimeout(function () {
                    $rootScope.$emit("errors", {});
                }, 1000);

            }
        })['finally'](function () {
            $().resetAlive();
        });
        deferred.promise.cancel = function () {
            deferred.reject('CANCELLED')
        };
        return deferred.promise;
    };
    this.getErrorMessage = function (code) {
        switch (code) {
            case 400:
                return "Bad Request";
            case 401:
                return "Unauthorized";
            case 403:
                return "Forbidden";
            case 404:
                return "Not Found";
            case 500:
                return "Internal Server Error";
            case -1:
                return "Gateway Timeout";
            default:
                return "";
        }
    };
    this.pendingReq = function () {
        return httpLoader.pending();
    };
}]);

/* Directives */
myApp.directive('showTab', function () {
    return {
        link: function (scope, element, attrs) {
            element.click(function (e) {
                e.preventDefault();
                $(element).tab('show');
            });
        }
    };
});
myApp.directive('showacc', function () {
    return {
        link: function (scope, element, attrs) {
            element.click(function (e) {
                e.preventDefault();
            });
        }
    };
});

myApp.directive('datepicker', function () {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ctrl) {
            $(element).datepicker({
                'clearButton': true
            });
            $(element).mask("99-99-9999", {
                placeholder: $().getConstant('DATE_FORMAT')
            });
            element.on("paste", function () {
                var val = element.value;
                ctrl.$modelValue = val;
                ctrl.$viewValue = val;
                ctrl.$setViewValue(val);
                ctrl.$commitViewValue();
                ctrl.$render();
            })
        }
    };
});
myApp.directive('pan', function () {
    return {
        link: function (scope, element, attrs) {
            $(element).mask("aaaaa9999a", {
                "placeholder": "",
                autoclear: false
            });
        }
    };
});
myApp.directive('confirmDialogue', function () {
    return {
        restrict: "E",
        scope: {
            title: "@",
            message: "@",
            callback: "&",
            okTitle: "@",
            cancelTitle: "@"
        },
        template: '<div id="confirmDlg" data-backdrop="static" class="modal fade fade-scale" role="dialog"><div class="modal-dialog sweet"><div class="modal-content"><div class="modal-body"><div class="m-icon m-warning pulseWarning"><span class="micon-body pulseWarningIns"></span><span class="micon-dot pulseWarningIns"></span></div><h2>{{title}}</h2><p ng-bind-html="message|trust"></p></div><div class="modal-footer"><button class="btn btn-default" data-dismiss="modal" ng-if="cancelTitle!==\'null\'">{{cancelTitle}}</button><button autofocus class="btn btn-primary" ng-click="callback()">{{okTitle}}</button></div></div></div></div>'
    };
});
myApp.directive('errorDialogue', function () {
    return {
        restrict: "E",
        scope: {
            title: "@",
            message: "@",
            cancelTitle: "@"
        },
        template: '<div id="errorDlg" data-backdrop="static" class="modal fade fade-scale" role="dialog"><div class="modal-dialog sweet"><div class="modal-content"><div class="modal-body"><div class="m-icon m-error"><span class="x-mark"><span class="m-line m-left"></span><span class="m-line m-right"></span></span></div><h2>{{title}}</h2><p ng-bind-html="message|trust"></p></div><div class="modal-footer"><button autofocus class="btn btn-default" data-dismiss="modal">{{cancelTitle}}</button></div></div></div></div>'
    };
});


myApp.directive('errorDialogueCallback', function () {
    return {
        restrict: "E",
        scope: {
            title: "@",
            message: "@",
            callback: "&",
            okTitle: "@",
        },
        template: '<div id="errorCllbackDlg" data-backdrop="static" class="modal fade fade-scale" role="dialog"><div class="modal-dialog sweet"><div class="modal-content"><div class="modal-body"><div class="m-icon m-error"><span class="x-mark"><span class="m-line m-left"></span><span class="m-line m-right"></span></span></div><h2>{{title}}</h2><p ng-bind-html="message|trust"></p></div><div class="modal-footer"><button class="btn btn-default" ng-click="callback()">{{okTitle}}</button></div></div></div></div>'
    };
});
myApp.directive('successDialogue', function () {
    return {
        restrict: "E",
        scope: {
            title: "@",
            message: "@"
        },
        template: '<div id="successDlg" data-backdrop="static" class="modal fade fade-scale" role="dialog"><div class="modal-dialog sweet"><div class="modal-content"><div class="modal-body"><div class="m-icon m-success loaded"><span class="m-line m-tip animateSuccessTip"></span><span class="m-line m-long animateSuccessLong"></span><div class="m-placeholder"></div><div class="m-fix"></div></div><h2>{{title}}</h2><p ng-bind-html="message|trust"></p></div></div></div></div>'
    };
});
myApp.directive('alertMessage', function () {
    return {
        restrict: "E",
        scope: {
            title: "@",
            type: "@",
            message: "@"
        },
        template: '<div class="alert alert-{{type}}"><a class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>{{title}}</strong> {{message}}.</div>'
    };
});

myApp.directive('infoDialogue', function () {
    return {
        restrict: "E",
        scope: {
            title: "@",
            message: "@",
            callback: "&",
            okTitle: "@",
            cancelTitle: "@"
        },
        template: '<div id="infoDlg" data-backdrop="static" class="modal fade fade-scale" role="dialog"><div class="modal-dialog sweet"><div class="modal-content"><div class="modal-body"><div class="m-icon m-warning pulseWarning" style="border-color: #337ab7;"><span class="micon-body pulseWarningIns" style="background-color: #337ab7;"></span><span class="micon-dot pulseWarningIns" style="background-color: #337ab7;"></span></div><h2>{{title}}</h2><p ng-bind-html="message|trust"></p></div><div class="modal-footer"><button class="btn btn-default" data-dismiss="modal" ng-if="cancelTitle!==\'null\'">{{cancelTitle}}</button><button autofocus class="btn btn-primary" ng-click="callback()">{{okTitle}}</button></div></div></div></div>'
    };
});

myApp.directive('warnDialogue', function () {
    return {
        restrict: "E",
        scope: {
            title: "@",
            message: "@",
            callback: "&",
            okTitle: "@",
            cancelTitle: "@"
        },
        template: '<div id="warDlg" data-backdrop="static" class="modal fade fade-scale" role="dialog"><div class="modal-dialog sweet"><div class="modal-content"><div class="modal-body"><div class="m-icon m-warning pulseWarning" style="border-color: #2c4e86;border-color: #2c4e86;"><span class="micon-body pulseWarningIns" style="background-color: #2c4e86"></span><span class="micon-dot pulseWarningIns" style="background-color: #2c4e86;"></span></div><h2>{{title}}</h2><p ng-bind-html="message|trust"></p></div><div class="modal-footer"><button class="btn btn-default" data-dismiss="modal" ng-if="cancelTitle!==\'null\'">{{cancelTitle}}</button><button autofocus class="btn btn-primary" ng-click="callback()">{{okTitle}}</button></div></div></div></div>'
    };
});
myApp.directive('warnDeleteDialogue', function () {
    return {
        restrict: "E",
        scope: {
            title: "@",
            message: "@",
            callback: "&",
            okTitle: "@",
            cancelTitle: "@"
        },
        template: '<div id="warDelteDlg" data-backdrop="static" class="modal fade fade-scale" role="dialog"><div class="modal-dialog sweet"><div class="modal-content"><div class="modal-body"><div class="m-icon m-warning pulseWarning" style="border-color: #2c4e86;"><span class="micon-body pulseWarningIns" style="background-color: #2c4e86;"></span><span class="micon-dot pulseWarningIns" style="background-color: #2c4e86;"></span></div><h2>{{title}}</h2><p ng-bind-html="message|trust"></p></div><div class="modal-footer"><button class="btn btn-default" data-dismiss="modal" ng-if="cancelTitle!==\'null\'">{{cancelTitle}}</button><button autofocus class="btn btn-primary" ng-click="callback()">{{okTitle}}</button></div></div></div></div>'
    };
});



if (!String.prototype.repeat) {
    String.prototype.repeat = function (count) {
        if (this === null) {
            throw new TypeError('can\'t convert ' + this + ' to object');
        }
        var rpt = '',
            str = "" + this;
        count = +count;
        if (count !== count) {
            count = 0;
        }
        if (count < 0) {
            throw new RangeError('repeat count must be non-negative');
        }
        if (count === Infinity) {
            throw new RangeError('repeat count must be less than infinity');
        }
        count = Math.floor(count);
        if (str.length === 0 || count === 0) {
            return '';
        }
        // Ensuring count is a 31-bit integer allows us to heavily optimize the
        // main part. But anyway, most current (August 2014) browsers can't handle
        // strings 1 << 28 chars or longer, so:
        if (str.length * count >= 1 << 28) {
            throw new RangeError('repeat count must not overflow maximum string size');
        }

        for (; ;) {
            if ((count & 1) === 1) {
                rpt += str;
            }
            count >>>= 1;
            if (count === 0) {
                break;
            }
            str += str;
        }
        // Could we try:
        // return Array(count + 1).join(this);
        return rpt;
    };
}


myApp.factory('utilFunctions', ["$q", "$log", "cache", "version", "$rootScope", "$filter", function ($q, $log, cache, version, $rootScope, $filter) {
    return {
        initCache: function () {
            var cversion = cache.get('version');
            if (cversion.length > 0) {
                if (cversion !== version) {
                    cache.clearAll();
                }
            } else {
                cache.set("version", version, 10000000000);
            }
            cache.removeExpired();
        },
        initLanguage: function (module) {
            var default_lang, l;
            if (navigator.cookieEnabled) {
                if (cache.get(module + ($().getCookie("Lang") || 'en')).length === 0) {
                    $rootScope.$emit("setDefaultLanguage");
                } else {
                    return cache.get(module + ($().getCookie("Lang") || 'en'));
                }
            } else {
                default_lang = $rootScope.lang || "en";
                if ($rootScope.langStore && $rootScope.langStore[module + default_lang]) {
                    return $rootScope.langStore[module + default_lang] || [];
                }
            }
        },
        createDialogue: function (config) {
            $("confirm-dialogue,error-dialogue,success-dialogue,error-dialogue-callback,info-dialogue,warn-dialogue,warn-delete-dialogue").remove();
            $(".modal-backdrop").remove();
            $("body").css("padding-right", "0").removeClass("modal-open");
            switch (config.type) {
                case 'Warning':
                    return ("<confirm-dialogue data-title='" + config.title + "' data-message='" + config.message + "' data-callback=\"" + config.callback + "()\" data-ok-title='" + config.ok_btn_title + "' data-cancel-title='" + config.cancel_btn_title + "'></confirm-dialogue>");
                case 'Error':
                    return ("<error-dialogue data-title='" + config.title + "' data-message='" + config.message + "' data-cancel-title='" + config.cancel_btn_title + "'></error-dialogue>");
                case 'ErrorCallback':
                    return ("<error-dialogue-callback data-title='" + config.title + "' data-message='" + config.message + "'   data-callback=\"" + config.callback + "()\" data-ok-title='" + config.ok_btn_title + "' ></error-dialogue>");
                case 'Success':
                    return ("<success-dialogue data-title='" + config.title + "' data-message='" + config.message + "'></success-dialogue>");
                case 'Info':
                    return ("<info-dialogue data-title='" + config.title + "' data-message='" + config.message + "' data-callback=\"" + config.callback + "()\" data-ok-title='" + config.ok_btn_title + "' data-cancel-title='" + config.cancel_btn_title + "'></info-dialogue>");
                case 'Warn':
                    return ("<warn-dialogue data-title='" + config.title + "' data-message='" + config.message + "' data-callback=\"" + config.callback + "()\" data-ok-title='" + config.ok_btn_title + "' data-cancel-title='" + config.cancel_btn_title + "'></warn-dialogue>");
                case 'WarnDelete':
                    return ("<warn-delete-dialogue data-title='" + config.title + "' data-message='" + config.message + "' data-callback=\"" + config.callback + "()\" data-ok-title='" + config.ok_btn_title + "' data-cancel-title='" + config.cancel_btn_title + "'></warn-delete-dialogue>");
              
            }

        },
        _destroyDialogue: function () {
            var x = $("confirm-dialogue,error-dialogue,success-dialogue").find(".modal");
            if (x.length > 0) {
                $('#myModal').on('hidden', function () {
                    x.parent().remove();
                    $(".modal-backdrop").remove();
                });
                x.modal('hide');
            }
        },
        createAlert: function (config) {
            return ("<alert-message data-title='" + config.title + "' data-type='" + config.type + "' data-message='" + config.message + "' ></alert-message>");
        },
        createDeleteDialogue: function (config) {
            return ("<delete-dialogue data-warning-title='" + config.warning.title + "' data-success-title='" + config.success.title +
                "' data-error-title='" + config.error.title + "'data-warning-message='" + config.warning.message +
                "data-success-message='" + config.success.message + "' data-error-message='" + config.error.message + "'" +
                "' data-success-callback=\"" + config.callback + "()\" data-error-callback=\"" + config.callback + "()\" " +
                "data-warning-callback=\"" + config.callback + "()\" data-warning-ok-title='" + config.warning.ok_btn_title +
                "' data-warning-cancel-title='" + config.warning.cancel_btn_title + "'></delete-dialogue>");
        },
        maskString: function (str, type, length) {
            if (str === undefined) {
                return false;
            }
            if (!length) {
                length = str.length;
            }
            if (str && str !== undefined && str.length >= length) {
                var strlength = str.length,
                    masklength = length,
                    unmasklength = strlength - length,
                    returnStr;
                if (type === 'prepend') {
                    returnStr = (str.replace(RegExp('^([^~,]{' + masklength + '})([^~,]{' + unmasklength + '})$'),
                        "x".repeat(masklength) + "$2"));
                } else if (type === 'append') {
                    returnStr = (str.replace(RegExp('^([^~,]{' + unmasklength + '})([^~,]{' + masklength + '})$'), "$1" + "x".repeat(masklength)));
                }

                return returnStr;
            }
        },
        emSignerConn: function (port) {
            var deferred = $q.defer(),
                conn;
            if (conn) {
                conn.close();
            }
            try {
                conn = new WebSocket("wss://127.0.0.1:" + port.trim());
                conn.onerror = function () {
                    $log.debug("Call Err:" + port);
                    deferred.reject({
                        "status": "404",
                        "error": "Connection Failed"
                    });
                    return deferred.promise;
                };
                conn.onmessage = function (e) {
                    var em_data = e.data.split("\n"),
                        verfy_length = 0;
                    $.map(em_data, function (i) {
                        var xd = i.split("=");
                        if (xd.length > 0) {
                            if ((xd[0].trim() == "version" && xd[1].trim() == $().getConstant("LATEST_EM_VERSION")) || (xd[0].trim() == "ID" && xd[1].trim() == $().getConstant("EM_ENTY_ID"))) {
                                verfy_length++;
                            }
                        }
                    });
                    if (verfy_length == 2) {
                        deferred.resolve(conn);
                    } else {
                        //conn.close();
                        deferred.resolve({
                            "status": "500",
                            "error": "Please install and use correct version of emSigner"
                        });
                    }
                    //deferred.resolve(conn);
                };
                conn.onopen = function () {
                    $log.debug("Call Opened:" + port);
                    //deferred.resolve(conn);
                    //$log.log(conn);
                };
            } catch (e) {
                deferred.reject({
                    "status": "404",
                    "error": "Connection Failed",
                    "port": port
                });
            }
            return deferred.promise;
        },
        connectEmsigner: function () {
            //var connPorts = [1645, 8080, 1812, 2083, 2948], conn, retVar, deferred = $q.defer(), ccount = 0, utilFun = this;
            var connPorts = $().getConstant("EM_PORTS").split(","),
                conn, retVar, deferred = $q.defer(),
                ccount = 0,
                utilFun = this,
                wrong_em;

            function connect() {
                //console.log("connecting.." + connPorts[ccount]);
                conn = utilFun.emSignerConn(connPorts[ccount]);
                conn.then(function (data) {
                    ccount++;
                    if (data.status && data.status == "500" && ccount < connPorts.length) {
                        connect();
                        wrong_em = data;
                    } else {
                        deferred.resolve(data);
                    }
                }, function (err) {
                    ccount++;
                    if (ccount < connPorts.length) {
                        connect();
                    } else {
                        if (!wrong_em) {
                            deferred.reject(err);
                        } else {
                            deferred.reject(wrong_em);
                        }

                    }
                });
            }
            connect();
            /*$.map(connPorts, function (port) {
                conn = null;
                conn = utilFun.emSignerConn(port);
                conn.then(function (data) {
                    if (retVar) {
                        return false;
                    }
                    retVar = true;
                    deferred.resolve(data);
                }, function (err) {
                    deferred.reject(err);
                });
                return false;
            });*/
            return (deferred.promise);
        },
        generateEntityId: function (array) {
            if (!array) {
                array = [];
            }
            var y = Math.max.apply(Math, array.map(function (o) {
                return o.eid;
            }));
            if (parseInt(y)) {
                y = y + 1;
            } else {
                y = 1;
            }
            if (($filter('ordinal')(array, 'eid', y)).length > 0) {
                return utilFun.generateEntityId(array);
            } else {
                return y;
            }
        }
    };
}]);

/* common controllers */
myApp.controller("transctrl", transctrl);
//myApp.controller("accessctrl", accessctrl);

transctrl.$inject = ['$scope', '$location', '$rootScope', 'translationSrv', 'utilFunctions', 'cache', 'ajax', '$route', 'breadcrumbs', "$compile", "$window"];

function transctrl($scope, $location, $rootScope, translationSrv, utilFunctions, cache, ajax, $route, breadcrumbs, $compile, $window) {
    this.module = '';
    $rootScope.$on('$routeChangeSuccess', function (event, current) {
        if ($route.current && $route.current.$$route && $route.current.$$route.bc) {
            breadcrumbs.setBreadcrumbs($route.current.$$route.bc);
        }
        $rootScope.path = $location.path();
    });
    $rootScope.$on('$routeChangeError', function (event, current) {
        $window.location.href = "error/notfound";
    });
    $rootScope.$on("setDefaultLanguage", function () {
        $scope.selectLang('en');
    });
    $scope.init = function (module) {
        var langinStore;
        this.module = module;
        if (navigator.cookieEnabled) {
            //cookies and local storage enabled
            langinStore = cache.get('languages') || [];
            if (!langinStore || langinStore.length === 0) {
                $scope.loadLang();
            } else {
                $scope.languages = langinStore;
                if ($().getCookie("Lang") !== '') {
                    //if(cache.get('lang') && cache.get('lang').length !== 0) {
                    //$scope.selectLang(cache.get('lang'));
                    $scope.selectLang($().getCookie("Lang"));
                } else {
                    $scope.selectLang('en');
                }
            }
        } else {
            //cookies and local storage disabled
            if (!$rootScope.languages || $rootScope.languages === 0) {
                $scope.loadLang();
            } else {
                $scope.languages = $rootScope.languages;
                //if($rootScope.lang && $rootScope.lang !== '') {
                if ($().getCookie("Lang") !== '') {
                    $scope.selectLang($().getCookie("Lang"));
                    //$scope.selectLang($rootScope.lang);
                } else {
                    $scope.selectLang('en');
                }
            }
        }

    };
    $scope.loadLang = function () {
        ajax.get("/lang/languages.json")
            .then(function (data) {
                $scope.languages = data.language;
                if (navigator.cookieEnabled) {
                    cache.set('languages', data.language);
                } else {
                    $rootScope.languages = data.language;
                }

                $scope.selectLang('en');
            }, function (err) {
                $window.location.href = "error/system";
            });
    };

    $scope.getLangTitle = function (ls, code) {
        var i;
        for (i in ls) {
            if (ls.hasOwnProperty(i)) {
                if (ls[i].cd.toString() === code.toString()) {
                    return ls[i].nm;
                }
            }
        }
        return 'English';
    };
    $scope.selectLang = function (lang) {
        var linStore, module, lstrore;
        if (navigator.cookieEnabled) {

            linStore = cache.get(this.module + lang) || [];

            if (linStore.length === 0 || !linStore) {
                module = this.module;
                translationSrv.getTranslation(lang, module).then(function (d) {
                    if (d && d !== '' && d !== undefined) {
                        $scope.selectedLang = $scope.getLangTitle(cache.get("languages"), lang);
                        $scope.trans = d;
                        cache.set(module + lang, d);
                        $().setCookie("Lang", lang, 150);
                        $rootScope.$emit("LangChanged", {
                            "selectedLang": $scope.selectedLang
                        });
                    } else {
                        var conf = utilFunctions.createDialogue({
                            "type": "Error",
                            "title": "Error",
                            "message": "Unable to translate, Please try after sometime.",
                            "cancel_btn_title": "close"
                        });
                        $('body').append($compile(conf)($scope));
                        $("#errorDlg").modal('show');
                    }

                }, function (err) {
                    $window.location.href = "error/system";
                });
            } else {
                $scope.selectedLang = $scope.getLangTitle(cache.get("languages"), lang);
                $scope.trans = linStore;
                $().setCookie("Lang", lang, 150);
                $rootScope.$emit("LangChanged", {
                    "selectedLang": $scope.selectedLang
                });
            }
        } else {
            $rootScope.lang = lang;
            //linStore = cache.get(this.module + lang) || []
            if ($rootScope.langStore && $rootScope.langStore.length !== 0 && $rootScope.langStore.indexOf(this.module + lang)) {
                $scope.selectedLang = $scope.getLangTitle($rootScope.languages, lang);
                $scope.trans = $rootScope.langStore[this.module + lang];
                $rootScope.$emit("LangChanged", {
                    "selectedLang": $scope.selectedLang
                });
            } else {
                lstrore = this.module + lang;
                $rootScope.langStore = [];
                translationSrv.getTranslation(lang, this.module).then(function (d) {
                    if (d && d !== '' && d !== undefined) {
                        $scope.trans = d;
                        $scope.selectedLang = $scope.getLangTitle($rootScope.languages, lang);
                        $rootScope.langStore[lstrore] = d;
                        $rootScope.$emit("LangChanged", {
                            "selectedLang": $scope.selectedLang
                        });
                    } else {
                        var conf = utilFunctions.createDialogue({
                            "type": "Error",
                            "title": "Error",
                            "message": "Unable to translate, Please try after sometime.",
                            "cancel_btn_title": "close"
                        });
                        $('body').append($compile(conf)($scope));
                        $("#errorDlg").modal('show');
                    }
                }, function (err) {

                    $window.location.href = "error/system";
                });
            }
        }


    };
}

myApp.service('translationSrv', ["$http", function ($http) {
    this.getTranslation = function (lang, path) {
        var languageFilePath = '/lang/' + path + '/translation-' + lang + '.json';
        return $http.get(languageFilePath).then(function (response) {
            return response.data;
        });
    };
}]);

myApp.factory('breadcrumbs', function () {
    var breadcrumbs = [],
        breadcrumbsService = {};
    breadcrumbsService.getAll = function () {
        return breadcrumbs;
    };
    breadcrumbsService.getFirst = function () {
        return breadcrumbs[0] || {};
    };
    breadcrumbsService.setBreadcrumbs = function (breadcrumb) {
        breadcrumbs = breadcrumb;
    };
    return breadcrumbsService;
});
myApp.controller('crumbCtrl', ['$scope', 'breadcrumbs', function ($scope, breadcrumbs) {
    $scope.breadcrumbs = breadcrumbs;
}]);
myApp.directive('breadcrumb', function () {
    return {
        restrict: "A",
        //templateUrl: "/templates/breadcrumb.html",
        template: '<ol class="breadcrumb" data-ng-controller="crumbCtrl"><li><a target="{{target}}" href="{{path}}" data-ng-bind="name"></a></li><li data-ng-repeat="breadcrumb in breadcrumbs.getAll()"><ng-switch on="$last"> <span ng-switch-when="true">{{breadcrumb.n}}</span> <span ng-switch-default><a ng-attr-target="{{(breadcrumb.t === true) ? undefined : \'_self\'}}" href="/{{breadcrumb.u}}" data-ng-bind="breadcrumb.n"></a></span> </ng-switch></li></ol>',
        scope: {
            path: "@",
            name: "@",
            target: "@"
        }
    };
});
myApp.directive('err', function () {
    return {
        restrict: "E",
        //template : '<div class="alert mar-t-10 alert-{{type}}"><strong>{{head}}!</strong> {{message}}.</div>',
        template: '<div id="myModal" data-backdrop="static" class="modal fade" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header">                       <button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">{{type}}</h4></div><div                                class="modal-body"><p>{{message}}</p></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>',
        scope: {
            message: "@",
            type: "@"
        },
        link: function (scope, element, attr) {

        }
    };
});
myApp.factory('httpTimeout', function () {
    return {
        'request': function (config) {
            config.timeout = 1000000; // REQUIRED FOR EXCEL IMPORT
            return config;
        }
    };
});
myApp.factory('httpLoader', function () {
    var pendingReqs = 0;
    return {
        add: function (url) {
            pendingReqs += 1;
        },
        sub: function (url) {
            pendingReqs -= 1;
        },
        pending: function () {
            return pendingReqs;
        }
    };
});

myApp.factory('httpInterceptor', ['$q', 'httpLoader', function ($q, httpLoader) {
    return {
        request: function (request) {
            if (request.beforeSend) {
                request.beforeSend();
            }

            httpLoader.add();
            return request;
        },
        response: function (response) {
            if (response.config.complete) {
                response.config.complete(response);
            }

            httpLoader.sub();
            return response;
        },
        responseError: function (rejection) {
            httpLoader.sub();
            if (!rejection.config.url.endsWith(".html")) {
                if (rejection.status === 403) {
                    $().resetDigest();
                    location.href = "error/accessdenied";
                }
            } else {
                rejection.data = '<div><p>Unable to load template</p></div>';
                return rejection;
            }

            return $q.reject(rejection);
        }
    };
}]);


myApp.run(["$rootScope", "ngProgressFactory", "ajax", "$route", function ($rootScope, ngProgressFactory, ajax, $route) {
    $rootScope.progressbar = ngProgressFactory.createInstance();
    $rootScope.$on('$routeChangeStart', function (event) {
        if (window.location.href.indexOf("/auth") > 0) {
            ajax.isAuthorized();
        }
        $rootScope.progressbar.start();
        $().blockPage(true);
    });

    $rootScope.$on('$routeChangeSuccess', function () {
        if ($route.current && $route.current.$$route && $route.current.$$route.title) {
            document.title = $route.current.$$route.title;
        }
        $rootScope.progressbar.complete();
        $().blockPage(false);
        setTimeout(function () {
            /*$().digestInit();*/
            //$().setExtLinks();
            $().reposFooter();
        }, 1000);

        $(".navbar-collapse").removeClass("in");
    });
    $rootScope.$on('$routeChangeError', function () {
        $rootScope.progressbar.complete();
        $(".navbar-collapse").removeClass("in");
    });
    $rootScope.$on('$viewContentLoaded', function (event) {
        console.log("View loaded");
    });
    $rootScope.$on('$includeContentLoaded', function (event, url) {
        /*if(url.split("/").pop() == "footer.html"){
            $rootScope.footerLoaded = true;
        }
        if(url.split("/").pop() == "menu.html"){
            $rootScope.menuLoaded = true;
        }
        if($rootScope.menuLoaded && $rootScope.footerLoaded) {
            $().blockPage(false);
        }*/
    });
    if (window.constants && Object.keys(window.constants).length > 0) {
        $.each(window.constants, function (key, value) {
            $().setConstant(key, value);
        });
    }
}]);
myApp.directive('selectPicker', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        require: '?ngModel',
        priority: 10,
        compile: function (tElement, tAttrs, transclude) {
            tElement.selectpicker({
                "iconBase": "fa",
                "tickIcon": "fa-check",
                "showTick": true,
                "style": "btn-dflt form-control"
            });
            tElement.selectpicker('refresh');
            return function (scope, element, attrs, ngModel) {
                if (!ngModel) return;
                scope.$watch(attrs.ngModel, function (newVal, oldVal) {
                    scope.$evalAsync(function () {
                        element.val(newVal);
                        element.selectpicker('refresh');
                    });
                });
                ngModel.$render = function () {
                    scope.$evalAsync(function () {
                        element.selectpicker('refresh');
                    });
                }
            };
        }

    };
}]);
myApp.directive('photoModel', ['ajax', '$q', '$parse', 'cameraAPI', function (ajax, $q, $parse, cameraAPI) {
    function link(scope, element, attrs) {
        scope.setErr = function (msg) {
            scope.err = msg;
        };
        scope.openCamera = function () {
            scope.captured = false;
            scope.videoStreams = {};
            scope.setErr("Connecting to device..");
            var stream = cameraAPI.openCamera('video' + scope.id, 'canvas' + scope.id);
            stream.then(function (stream) {
                scope.openedCamera = true;
                scope.videoStreams[scope.name] = stream;
                scope.setErr("");
            }, function (err) {
                scope.setErr(err.error);
            });
        };
        scope.captureCamera = function () {
            scope.captured = true;
            var videoObj = document.getElementById('video' + scope.id),
                canvas = document.getElementById('canvas' + scope.id),
                context = canvas.getContext("2d");
            context.drawImage(videoObj, 0, 0, 240, 200);
            cameraAPI.closeCamera(scope.videoStreams[scope.name]);
            delete scope.videoStreams[scope.name];
        };
        scope.tryagain = function () {
            scope.openCamera();
        };
        scope.closeCanvas = function () {
            scope.captured = false;
        };
        scope.upload = function () {
            scope.uploadImg().then(function (resp) {
                scope.closeCanvas();
                scope.callback({
                    'resp': resp
                });
            }, function (err) {
                scope.setErr(err.error);
            });

        }
        scope.uploadImg = function () {
            var canvas = document.getElementById('canvas' + scope.id),
                file = canvas.toDataURL("image/jpeg"),
                formdata = {},
                deferred = $q.defer();
            formdata.upfile = file;
            formdata.applnid = scope.applId;
            formdata.ty = scope.docType;

            ajax.post("/document/b64", formdata, {}, function () {
                scope.setErr("Uploading..");
            }, function () { }).then(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject({
                    "error": "Error occured in uploading image, try again"
                });
            });
            return deferred.promise;
        }
    }
    return {
        restrict: 'E',
        scope: {
            callback: '&',
            id: '@',
            name: '@',
            applId: '@',
            docType: '@'
        },
        template: function (attrs) {
            var output = "<div class='col-xs-12 text-center'>" + "<button ng-click='openCamera()' title='Take Picture' type='button' class='btn btn-primary' data-ng-if='(videoStreams | numkeys).length == 0 && !captured'><i class='fa fa-camera'></i> Take Picture</button>" + "<p data-ng-if='(videoStreams | numkeys).length == 0 && !captured'><span class='fa fa-info-circle'>You can use your device camera to take selfie photograph.</span></p><video id='video{{id}}' name='{{name}}' width='240' height='200' autoplay data-ng-show = '(videoStreams | numkeys).length > 0 && !captured'></video>" + "<canvas id='canvas{{id}}' width='240' height='200' data-ng-show='captured'></canvas></div><div class='col-xs-12 text-center'>" + "<button class='btn btn-primary' ng-click='captureCamera()' type='button' data-ng-show='!captured && (videoStreams | numkeys).length > 0'>Capture</button>" + "<button type='button' ng-click='tryagain()' class='btn btn-primary' data-ng-show='captured'>Try Again</button>" + "<button type='button' ng-click='upload()' data-ng-show='captured' class='btn btn-primary'>Upload</button>" + "<p class='err' data-ng-bind='err'></p></div>";
            return output;
        },
        compile: function (ele) {
            return link;
        }
    };
}]);
myApp.directive('customSelect', ['ajax', '$http', '$compile', function (ajax, $http, $compile) {

    return {
        restrict: "E",
        scope: {
            id: "@",
            selectmodel: "=",
            name: "@",
            dptype: "@",
            placeholder: "@",
            options: "=",
            optntype: "@",
            optRemoteUrl: "@",
            callback: "&",
        },
        template: '<select data-ng-model="selectmodel" class="form-control" id={{id}} name={{name}} data-ng-options="data.c as data.n for data in selectedItemList" data-ng-change="sendData(this.selectmodel)" data-ng-if="singleLocalSel" ></select>' +

            '<select data-ng-model="selectmodel" class="form-control" id={{id}} name={{name}} data-ng-options="data.c as data.n for data in selectedItemList" data-ng-change="sendData(this.selectmodel)" data-ng-if="singleRemoteSel"></select>' +

            '<div data-ng-if="multiSelLocalFlag"><dl class="multiselect"><dt><a href="#" class="statelisterr"><input data-ng-model="selectmodel" class="form-control pad-r-0 hida " type="text" data-ng-click="sliding()" data-ng-change="typeSelectFilter()" placeholder="Select"/><button type="button" id="caret" data-ng-click = "sliding()"> &#9660;</button><p class="multiSel"></p></a></dt><dd><div class="mutliSelect" id="multiSel" ng-show="showList"><div class="multiselect-content"><ul><li data-ng-repeat="data in options | filter:selectmodel " ><label class="reg bigchecklabel"><input type="checkbox" ng-checked="selectedItemList.indexOf(data) > -1" class="bigcheckbox" id="{{data.c}}" data-ng-click="multiSelectVals(data)" value={{data.c}}/> {{data.n}}</label></li></ul></div></div></dd></dl>                    <br><br>     <div class="row pad-t-20"><span class="stateselected" data-ng-repeat="data in selectedItemList">{{data.n}} <span class="statecancel" data-ng-click="removeMultiSelRem(data)">X</span></span></div></div>' +

            '<div data-ng-if="multiSelRemoteFlag"><dl class="multiselect"><dt><a href="#" class="statelisterr"><input data-ng-model="selectmodel" class="form-control pad-r-0 hida " type="text" data-ng-click="sliding()" placeholder="Select" data-ng-change="typeSelectFilter()" /><button type="button" id="caret" data-ng-click = "sliding()"> &#9660;</button><p class="multiSel"></p></a></dt><dd><div class="mutliSelect" id="multiSel" ng-show="showList"><div class="multiselect-content"><ul><li id="selListDir" data-ng-repeat="data in optionsRemMulti | filter:selectmodel" ><label class="reg bigchecklabel"><input type="checkbox" ng-checked="selectedItemList.indexOf(data) > -1"  class="bigcheckbox" id="{{data.c}}" data-ng-click="multiSelectVals(data)" value={{data.c}}/> {{data.n}}</label></li></ul></div></div></dd></dl>                   <br><br>      <div class="row pad-t-20"><span class="stateselected" data-ng-repeat="data in selectedItemList">{{data.n}} <span class="statecancel" data-ng-click="removeMultiSelRem(data)">X</span></span></div></div>',


        link: function (scope, element, attrs) {

            $(document).bind('click', function (e) {
                var $clicked = $(e.target);
                if (!$clicked.parents().hasClass("multiselect")) {
                    console.log("in");
                    $(".multiselect dd ul").hide();
                    scope.showList = false;
                } else {
                    $(".multiselect dd ul").show();
                    //                    scope.showList = true;
                }
            });

            scope.selectedItemList = [];
            scope.multiSelLocalFlag = false;
            scope.multiSelRemoteFlag = false;
            scope.singleRemoteSel = false;
            scope.singleLocalSel = false;
            scope.showList = false;
            //to toggle display of list in multi select
            scope.sliding = function () {
                scope.showList = !scope.showList;
            };
            // to show list when user is typing
            scope.typeSelectFilter = function () {
                scope.showList = true;
            };
            scope.sendData = function (object) {
                for (var i = 0; i < scope.selectedItemList.length; i++) {
                    if (scope.selectedItemList[i].c === object) {
                        scope.callback({
                            objectList: scope.selectedItemList[i]
                        });
                        break;
                    }
                }
            };
            // remove values when clicked on span and uncheck checkbox value in list 
            scope.removeMultiSelRem = function (object) {
                angular.forEach(scope.selectedItemList, function (item, key) {
                    if (item.c == object.c) {
                        $("#" + item.c).prop("checked", false);
                    }
                });
                var index = scope.selectedItemList.indexOf(object);
                scope.selectedItemList.splice(index, 1);
                scope.callback({
                    objectList: scope.selectedItemList
                });
            };

            // store checked values function
            scope.multiSelectVals = function (object) {
                var index = scope.selectedItemList.indexOf(object);
                if (index !== -1) {
                    scope.selectedItemList.splice(index, 1);
                } else {
                    scope.selectedItemList.push(object);
                }
                scope.callback({
                    objectList: scope.selectedItemList
                });
            };


            if (attrs.dptype == "single") {
                if (attrs.optntype == "local") {
                    scope.selectedItemList = scope.options;
                    scope.singleLocalSel = true;
                } else if (attrs.optntype == "remote") {
                    ajax.get(attrs.optRemoteUrl).then(function (response) {
                        scope.selectedItemList = response.data;
                        scope.singleRemoteSel = true;
                    }, function (err) {
                        console.log(err);
                    });
                }
            } else if (attrs.dptype == "multiselect") {
                if (attrs.optntype == "local") {
                    scope.multiSelLocalFlag = true;
                } else if (attrs.optntype == "remote") {
                    ajax.get(attrs.optRemoteUrl).then(function (response) {
                        scope.optionsRemMulti = response.data;
                        scope.multiSelRemoteFlag = true;
                    }, function (err) {
                        console.log(err);
                    });
                }
            }
        }
    };

}]);

myApp.directive('fileModel', ['$q', 'ajax', '$parse', '$http', '$compile', 'utilFunctions', '$timeout', 'cache', function ($q, ajax, $parse, $http, $compile, utilFunctions, $timeout, cache) {
    function getDocSize() {
        if (cache.get('docsize').length > 0) {
            return cache.get('docsize');
        }
        var deferred = $q.defer();
        ajax.get("/master/docsize").then(function (resp) {
            cache.set('docsize', resp.data);
            deferred.resolve(resp.data);
        }, function (err) {
            deferred.reject({
                "error": "Unable to read File Max Size."
            });
        });
        return deferred.promise;
    }

    function link(scope, element, attrs) {
        if (scope.mandatory) {
            scope.required = "required";
        } else {
            scope.required = "";
        }
        //scope.progressbar = "0%";
        // scope.uploading = false;
        scope.abortUpload = function () {
            if (scope.currentConnection) {
                scope.currentConnection.abort();
            }
        };
        /* parked for later implmmmmmm
        element.on('dragover', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
        element.on('dragenter', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
        element.on('drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if(e.originalEvent.dataTransfer.files.length > 0) {
                console.log(e.originalEvent.dataTransfer.files)
            }
            return false;
        });*/
        scope.getAllowedSize = function () {
            var allow_size = 1000;
            $.map(scope.maxSizeArray, function (upitem) {
                if (upitem.c === scope.docType) {
                    allow_size = parseInt(upitem.n, 10) / 1024;
                }
            });
            return allow_size;
        };
        scope.setError = function (errMsg) {
            $timeout(function () {
                scope.$apply(function () {
                    scope.errVar = errMsg;
                });
            }, 10);
        };
        scope.validateFile = function () {
            scope.setError("");
            var file = element.find("input")[0]['files'][0],
                fileReader = new FileReader(),
                header = "",
                i, type, arr;
            if (file.name && file.name.length > 75) {
                scope.setError("Invalid filename, filename can not exceed 75 characters");
                return false;
            }

            scope.allow_size = scope.getAllowedSize();
            if ((file.size) / 1024 <= scope.allow_size) {
                fileReader.readAsArrayBuffer(file);
                fileReader.onloadend = function (e) {
                    arr = (new Uint8Array(e.target.result)).subarray(0, 4);
                    for (i = 0; i < arr.length; i = i + 1) {
                        header += arr[i].toString(16);
                    }
                    switch (header) {
                        case "89504e47":
                            type = "image/png";
                            break;
                        case "ffd8ffe0":
                        case "ffd8ffe1":
                        case "ffd8ffe2":
                            type = "image/jpeg";
                            break;
                        case "25504446":
                            type = "application/pdf";
                            break;
                    }
                    var formdata = new FormData();
                    formdata.append("upfile", file);
                    formdata.append("ty", scope.docType);
                    formdata.append("applnid", scope.applnId);
                    if (scope.docType === "PHOT") {
                        if (file.type === "image/jpeg" && type !== "image/jpeg") {
                            $(element).find("input").val('');
                            scope.setError("JPEG file uploaded is corrupted");
                        } else if (file.type !== "image/jpeg") {
                            $(element).find("input").val('');
                            scope.setError("File with JPEG formats is only allowed");
                        } else {
                            scope.setError("");
                            scope.upload(formdata);
                        }
                    } else {
                        if (type !== "image/jpeg" && type !== "application/pdf") {
                            $(element).find("input").val('');
                            if (file.type === "application/pdf" && type !== "application/pdf") {
                                scope.setError("PDF file uploaded is corrupted");
                            } else if (file.type === "image/jpeg" && type !== "image/jpeg") {
                                scope.setError("JPEG file uploaded is corrupted");
                            } else {
                                scope.setError("File with PDF/JPEG formats is only allowed");
                            }
                        } else {
                            scope.setError("");
                            scope.upload(formdata);
                        }
                    }
                };

            } else {
                $(element).find("input").val('');
                if (scope.allow_size >= 1000) {
                    scope.setError("Only maximum file size of 1MB is allowed");
                } else {
                    scope.setError("Max file upload size is " + scope.allow_size + " KB");
                }
            }
        };
        scope.upload = function (formdata) {
            scope.currentConnection = $.ajax({
                type: "POST",
                url: "/document/",
                enctype: 'multipart/form-data',
                data: formdata,
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: function (request) {
                    //scope.$apply(function () {
                    scope.uploading = true;
                    //});
                    $(element).find("input").attr('disabled', true);
                },
                complete: function () {
                    $(element).find("input").attr('disabled', false);
                },
                success: function (data) {
                    if (!attrs.maxFiles || parseInt(attrs.maxFiles, 10) === 1) {
                        scope.ngModel = [];
                    } else {
                        if (!scope.ngModel) {
                            scope.ngModel = [];
                        }
                    }
                    scope.ngModel.push(data);
                    $(element).find("input").val('');
                    scope.setError("");
                    $timeout(function () {
                        scope.$apply(function () {
                            scope.uploadSuccess = true;
                            scope.uploading = false;
                            $(element).find("input").attr('disabled', false);
                        });
                    }, 100);
                },
                error: function (xhr) {
                    if (xhr.status === 403) {
                        $().resetDigest();
                        location.href = "error/accessdenied";
                    }
                    $(element).find("input").val('');
                    scope.setError("Errors encountered while uploading the file");
                    $timeout(function () {
                        scope.$apply(function () {
                            scope.uploading = false;
                            scope.uploadSuccess = false;
                            scope.progress_bar = "0%";
                        });
                    }, 100);
                },
                xhr: function () {
                    var xhr = $.ajaxSettings.xhr(),
                        upperc;
                    xhr.upload.onprogress = function (evt) {
                        $timeout(function () {
                            scope.$apply(function () {
                                upperc = Math.ceil(evt.loaded / evt.total * 100);
                                scope.progress_bar = ((upperc === 100) ? 99 : upperc) + "%";
                            });
                        }, 100);
                    };
                    xhr.upload.onload = function () {
                        //console.log('DONE!') 
                    };
                    return xhr;
                }
            });
        };
        element.bind('change', function () {
            if (scope.docType === "" || !scope.docType) {
                scope.setError("Please select the type of document");
                $(element).find("input").val('');
                return;
            }
            if (typeof getDocSize() === 'object') {
                scope.maxSizeArray = getDocSize();
                scope.validateFile();
            } else {
                getDocSize().then(function (data) {
                    scope.maxSizeArray = data;
                }, function (err) {
                    scope.maxSizeArray = [];

                })['finally'](function () {
                    scope.validateFile();
                });
            }

            if ($("video").length > 0) {
                $("video").fadeOut("slow");
            }
            if ($("canvas").length > 0) {
                $("canvas").fadeOut("slow");
            }
        });
    }
    return {
        restrict: 'E',
        scope: {
            ngModel: '=',
            docType: '=',
            id: '@',
            name: '@',
            maxFiles: '@',
            mandatory: '@',
            applnId: "="
        },
        template: function (attrs) {
            var output = "<input id='{{id}}' name='{{name}}' type='file' '{{required}}'";
            output += "/><p class='err' data-ng-bind='errVar'></p><div class='progress' data-ng-show='uploading'>" +
                "<div class='progress-bar' ng-class='{\"progress-bar-danger\" : uploadFailed, \"progress-bar-success\" : uploadSuccess}' role='progressbar' style='width:{{progress_bar}}'>{{progress_bar}}</div></div>" +
                "<button type='button' ng-if='uploading' class='btn btn-sm btn-danger' ng-click='abortUpload()'>Cancel Upload</button>";
            return output;
        },
        compile: function (ele) {
            return link;
        }
    };
}]);
myApp.directive("isAuth", function () {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element.bind('click', function () {
                if (!$().getCookie("localAuthToken") && $().getCookie("localAuthToken") === "") {
                    $().keepalive();
                }
            });
        }
    };
});
myApp.directive("confClick", ["utilFunctions", "$compile", function (utilFunctions, $compile) {
    return {
        priority: -1,
        restrict: 'A',
        scope: {
            confirmFunction: "&confClick"
        },
        link: function (scope, element, attrs) {
            element.bind('click', function (e) {
                var msg = attrs.msg,
                    conf;
                if (!msg || msg === "") {
                    msg = "Are you sure, you want to continue?";
                }
                conf = utilFunctions.createDialogue({
                    "type": "Warning",
                    "title": "Warning",
                    "message": msg,
                    "callback": "confirmFunction()",
                    "ok_btn_title": "YES",
                    "cancel_btn_title": "NO"
                });

                $('body').append($compile(conf)(scope));
                $("#confirmDlg").modal({
                    show: true,
                    backdrop: 'static'

                });
                //if(confirm(msg))
                //scope.confirmFunction();
            });
        }
    };
}]);
myApp.service('cameraAPI', ['$q', function ($q) {

    this.video_cap = {
        "video": true
    };
    this.checkWebCam = function () {

        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
            // Firefox 38+ seems having support of enumerateDevicesx
            navigator.enumerateDevices = function (callback) {
                navigator.mediaDevices.enumerateDevices().then(callback);
            };
        }
        var canEnumerate = false,
            deferred = $q.defer(),
            con = {
                camera: false
            },
            x, i, device;
        if (typeof MediaStreamTrack !== 'undefined' && 'getSources' in MediaStreamTrack) {
            canEnumerate = true;
        } else if (navigator.mediaDevices && !!navigator.mediaDevices.enumerateDevices) {
            canEnumerate = true;
        }
        if (!navigator.enumerateDevices && window.MediaStreamTrack && window.MediaStreamTrack.getSources) {
            navigator.enumerateDevices = window.MediaStreamTrack.getSources.bind(window.MediaStreamTrack);
        }

        if (!navigator.enumerateDevices && navigator.enumerateDevices) {
            navigator.enumerateDevices = navigator.enumerateDevices.bind(navigator);
        }
        if (navigator.enumerateDevices) {
            x = navigator.enumerateDevices(function (devices) {
                for (i = 0; i < devices.length; i = i + 1) {
                    device = devices[i];
                    if (device.kind === 'video' || device.kind === 'videoinput') {
                        con = {
                            camera: true
                        };
                    }
                }
                deferred.resolve(con);
            });
            return deferred.promise;
        }
    };

    this.openCamera = function (videoEle, canvas) {
        var videoObj = document.getElementById(videoEle),
            deferred = $q.defer();

        /*$("#" + canvas).fadeOut("slow", function () {
            $("#" + videoEle).fadeIn();
        });*/
        try {
            if (navigator.webkitGetUserMedia) {
                navigator.webkitGetUserMedia(this.video_cap, function (stream) {
                    videoObj.src = window.URL.createObjectURL(stream);
                    var playPromise = videoObj.play();
                    //console.log(playPromise)
                    if (playPromise !== undefined) {
                        playPromise.then(function () {
                            deferred.resolve(stream.getTracks()[0]);
                        }, function (error) {
                            deferred.reject({
                                "error": "Error in playback. Unable to get media from device camera."
                            });
                        });
                    }
                }, function (error) {
                    //console.log("error code"+ error.code);
                    deferred.reject({
                        "error": "Error in playback. Unable to get media from device camera."
                    });
                });
            } else if (navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({
                    video: true
                }).then(function (stream) {
                    videoObj.src = window.URL.createObjectURL(stream);
                    //console.log(stream)
                    var playPromise = videoObj.play();
                    if (playPromise !== undefined) {
                        playPromise.then(function () {
                            deferred.resolve(stream.getTracks()[0]);
                        }, function () {
                            deferred.reject({
                                "error": "Error in playback. Unable to get media from device camera."
                            });
                        });
                    }
                }, function (error) {
                    //console.log("error"+ error.code);
                    deferred.reject({
                        "error": "Error in playback. Unable to get media from device camera."
                    });
                });
            } else if (navigator.getUserMedia) {
                //standard
                navigator.getUserMedia(this.video_cap, function (stream) {
                    videoObj.src = stream;
                    var playPromise = videoObj.play();
                    if (playPromise !== undefined) {
                        playPromise.then(function () {
                            deferred.resolve(stream.getTracks()[0]);
                        }, function (error) {
                            deferred.reject({
                                "error": "Error in playback. Unable to get media from device camera."
                            });
                        });
                    }
                }, function (error) {
                    //console.log("error code"+ error.code)
                    deferred.reject({
                        "error": "Error in playback. Unable to get media from device camera."
                    });
                });
            }
        } catch (e) {
            deferred.reject({
                "error": "Unable to get media from device camera."
            });
        }


        return deferred.promise;
    };
    this.closeCamera = function (stream) {
        stream.stop();
    };
    this.uploadPhoto = function (docType) {
        //console.log("Upload" + docType);
    };
}]);
myApp.directive("radioChbx", [
    function () {
        return {
            restrict: 'A',
            scope: {
                ngModel: "="
            },
            link: function (scope, element, attrs) {
                if (scope.ngModel === undefined && $(element).prop("type") !== "radio") {
                    scope.ngModel = "N";
                }
                element.bind('click', function (e) {
                    scope.$apply(function () {
                        if ($(element).prop("type") === "radio") {
                            scope.ngModel = $(element).prop("value");
                        } else {
                            scope.ngModel = ($(element).prop("checked")) ? "Y" : "N";
                        }
                    });
                });
            }
        };
    }
]);
myApp.directive('link', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            $(elem).find('a:not([href="#"])').attr("target", "_self");
        }
    };
});
myApp.directive('accessibleForm', function () {
    return {
        restrict: 'A',
        scope: {
            "accessibleForm": "&"
        },
        link: function (scope, elem, attrs) {
            attrs.$set('autocomplete', "off");
            attrs.$set('novalidate', "");
            var $el = $(elem),
                submitBtn = $el.find('button[type="submit"]');
            submitBtn.on('dblclick', function () {
                return false;
            });
            elem.on('submit', function (e) {
                /*var firstInvalid = elem[0].querySelector('.ng-invalid') || elem[0].querySelector('.ng-invalid:not(.ng-invalid-parse)');
                if (firstInvalid) {
                    firstInvalid.focus();
                } else {
                	
                }*/
                var notEng;
                $(elem).find("input[type=text], textarea").each(function () {
                    if ($(this).val().trim() != "" && (!/^[A-Za-z0-9@#$%&*()-_ =+:;'"/\<>₹%\n\r]+$/.test($(this).val().trim()))) {
                        if (scope.$parent[attrs['name']][$(this).attr("name")]) {
                            scope.$parent[attrs['name']][$(this).attr("name")].$setValidity("text", false);
                        }
                        notEng = true;
                    } else {
                        if (scope.$parent[attrs['name']][$(this).attr("name")]) {
                            scope.$parent[attrs['name']][$(this).attr("name")].$setValidity("text", true);
                        }
                    }
                });
                if (!notEng) {
                    scope.accessibleForm();
                } else {
                    scope.$apply();
                }
            });
        }
    };
});
myApp.directive('autocompleteDropdown', ['$q', '$parse', '$http', '$sce', '$timeout', '$templateCache', '$interpolate', '$window', 'shareData', '$location',
    function ($q, $parse, $http, $sce, $timeout, $templateCache, $interpolate, $window, shareData, $location) {
        var KEY_DW = 40,
            KEY_RT = 39,
            KEY_UP = 38,
            KEY_LF = 37,
            KEY_ES = 27,
            KEY_EN = 13,
            MIN_LENGTH = 3,
            BLUR_TIMEOUT = 200,
            TEMPLATE_URL = '/pages/registration/autocompleteGoodsServices.html';
        //ng-blur="hideResults($event)"
        $templateCache.put(TEMPLATE_URL,
            '<div class="autocomplete-holder" data-ng-mouseup="mouseup($event)" data-ng-mousedown="mousedown($event)">' +
            '  <input id="{{id}}_value" name="{{inputName}}" data-ng-model="searchStr" type="text" placeholder="{{placeholder}}"' +
            'data-ng-blur="hideResults($event)"  data-ng-focus="focusHandler()" maxlength="{{maxlength}}" class="form-control" autocapitalize="off" autocorrect="off" autocomplete="off" data-ng-change="inputChangeHandler(searchStr)" data-ng-readonly="disableAfterSelect && selectedResult" data-ng-class="{\'hasclear\':disableAfterSelect}"/><span data-ng-if="disableAfterSelect && searchStr.length > 0 && selectedResult" data-ng-click="resetField()"  class="clearer fa fa-close"></span>' +
            '  <div id="{{id}}_dropdown" class="autocomplete-dropdown" ng-show="showDropdown" ng-class="{\'dpdwn\' : !showViewAll && results.length>5 }">' +
            '    <div class="autocomplete-searching" ng-show="searching" ng-bind="textSearching"></div>' +
            '    <div class="autocomplete-searching" ng-show="!searching && (!results || results.length == 0)" ng-bind="textNoResults"></div>' +
            '    <div class="autocomplete-row" ng-repeat="result in results | limitTo: showViewAll ? 5 : results.length" ng-click="selectResult(result)" ' +
            ' ng-mouseenter="hoverRow($index)" ng-class="{\'autocomplete-selected-row\': $index == currentIndex}">' +
            '      <div class="autocomplete-title" ng-if="matchClass && dropdownSearch != \'true\' "  ng-bind-html="result.title"></div>' +
            '      <div class="autocomplete-title" ng-if="!matchClass && dropdownSearch != \'true\' ">{{ result.title }}</div>' +
            '      <div ng-if="matchClass && result.description && result.description != \'\'" class="autocomplete-desc" ng-bind-html="result.description"></div>' +
            '      <div ng-if="!matchClass && result.description && result.description != \'\'" class="autocomplete-desc">{{result.description}}</div>' +
            '    </div>' +
            '<div class="autocomplete-dropdown-all" ng-show="showDropdown && results.length>5 && showViewAll"><p ng-click="viewAll()"> View All</p></div>' +
            '  </div>' +
            '</div>');

        function link(scope, elem, attrs, ctrl) {
            var inputField = elem.find('input'),
                minlength = MIN_LENGTH,
                searchTimer = null,
                hideTimer, httpCanceller = null,
                dd = elem[0].querySelector('.autocomplete-dropdown'),
                isScrollOn = false,
                mousedownOn = null,
                displaySearching, displayNoResults, $popup;
            scope.currentIndex = null;
            scope.searching = false;
            scope.selectedResult = false;
            if (scope.showViewAll === "true" || scope.showViewAll === true) {
                scope.showViewAll = true;
            } else {
                scope.showViewAll = false;
            }

            function clickoutHandlerForDropdown(event) {
                mousedownOn = null;
                scope.hideResults(event);
                document.body.removeEventListener('click', clickoutHandlerForDropdown);
            }

            // for IE8 quirkiness about event.which
            function ie8EventNormalizer(event) {
                return event.which || event.keyCode;
            }

            function extractValue(obj, key) {
                var keys, result, i;
                if (key) {
                    keys = key.split('.');
                    result = obj;
                    for (i = 0; i < keys.length; i = i + 1) {
                        result = result[keys[i]];
                    }
                } else {
                    result = obj;
                }
                return result;
            }

            function extractTitle(data) {
                return scope.titleField.split(',').map(function (field) {
                    return extractValue(data, field);
                }).join(' ');
            }

            function findMatchString(target, str) {
                var result, matches, re;
                re = new RegExp(str.replace(/[.*+?\^${}()|\[\]\\]/g, '\\$&'), 'i');
                if (!target) {
                    return;
                }
                if (!target.match || !target.replace) {
                    target = target.toString();
                }
                matches = target.match(re);
                if (matches) {
                    result = target.replace(re, '<span class="' + scope.matchClass + '">' + matches[0] + '</span>');
                } else {
                    result = target;
                }
                return $sce.trustAsHtml(result);
            }

            function initResults() {
                scope.showDropdown = displaySearching;
                scope.currentIndex = -1;
                scope.results = [];
            }

            function clearResults() {
                scope.showDropdown = false;
                scope.results = [];
                if (dd) {
                    dd.scrollTop = 0;
                }
            }

            function processResults(responseData, str) {
                var i, description, text, formattedText, formattedDesc;
                if (responseData && responseData.length > 0) {
                    scope.results = [];
                    for (i = 0; i < responseData.length; i = i + 1) {
                        if (scope.titleField && scope.titleField !== '') {
                            text = formattedText = extractTitle(responseData[i]);
                        }
                        description = '';
                        if (scope.descriptionField) {
                            description = formattedDesc = extractValue(responseData[i], scope.descriptionField);
                        }
                        if (scope.matchClass) {
                            formattedText = findMatchString(text, str);
                            formattedDesc = findMatchString(description, str);
                        }
                        scope.results[scope.results.length] = {
                            title: formattedText,
                            description: formattedDesc,
                            originalObject: responseData[i]
                        };
                    }
                } else {
                    scope.results = [];
                }
                if (scope.results.length === 0 && !displayNoResults) {
                    scope.showDropdown = false;
                } else {
                    scope.showDropdown = true;
                }
            }

            function cancelHttpRequest() {
                if (httpCanceller) {
                    httpCanceller.resolve();
                }
            }

            function getLocalResults(str) {
                //console.log("local results")
                var i, match, s, value, matches, searchFields = [];
                searchFields.push(scope.titleField);
                searchFields.push(scope.descriptionField);
                matches = [];
                for (i = 0; i < scope.localData.length; i = i + 1) {
                    match = false;
                    for (s = 0; s < searchFields.length; s = s + 1) {
                        value = extractValue(scope.localData[i], searchFields[s]) || '';
                        match = match || (value.toString().toLowerCase().indexOf(str.toString().toLowerCase()) >= 0);
                    }

                    if (match) {
                        matches[matches.length] = scope.localData[i];
                    }
                }
                return matches;
            }

            function getRemoteResults(str) {
                if (str === "" || str === undefined) {
                    scope.searching = false;
                    return;
                }
                var params = {
                    params: {
                        "q": str
                    }
                },
                    url = scope.remoteUrl;
                cancelHttpRequest();
                httpCanceller = $q.defer();
                params.timeout = httpCanceller.promise;
                $http.get(url + str)
                    .success(function (responseData) {
                        scope.searching = false;
                        processResults(extractValue(responseData, "data"), str);
                    }).error(function (err) {
                        scope.searching = false;
                        //console.log("Error");
                    });
            }

            function searchTimerComplete(str) {
                if ((!str || str.length < minlength) && scope.dropdownSearch !== 'true') {
                    return;
                }
                if (scope.localData) {
                    setTimeout(function () {
                        scope.$apply(function () {
                            var matches = getLocalResults(str);
                            scope.searching = false;
                            processResults(matches, str);
                        });
                    });
                } else {
                    getRemoteResults(str);
                }
            }
            scope.focusHandler = function () {
                if (!scope.showDropdown && scope.dropdownSearch === 'true') {
                    initResults();
                    scope.searchStr = "";
                    scope.searching = true;
                    searchTimerComplete(scope.searchStr);
                }
            };

            function keyupHandler(event) {
                var which = ie8EventNormalizer(event);
                if (which === KEY_LF || which === KEY_RT) {
                    return;
                }
                if (which === KEY_UP || which === KEY_EN) {
                    event.preventDefault();
                } else if (which === KEY_DW) {
                    event.preventDefault();
                    if (!scope.showDropdown && scope.searchStr && scope.searchStr.length >= minlength) {
                        initResults();
                        scope.searching = true;
                        searchTimerComplete(scope.searchStr);
                    }
                } else if (which === KEY_ES) {
                    clearResults();
                    scope.$apply(function () {
                        inputField.val(scope.searchStr);
                    });
                } else {
                    if (minlength === 0 && !scope.searchStr) {
                        return;
                    }
                    if ((!scope.searchStr || scope.searchStr === '') && scope.dropdownSearch !== 'true') {
                        scope.showDropdown = false;
                    } else if (scope.searchStr.length >= minlength) {
                        initResults();
                        if (searchTimer) {
                            $timeout.cancel(searchTimer);
                        }
                        scope.searching = true;
                        searchTimer = $timeout(function () {
                            searchTimerComplete(scope.searchStr);
                        }, scope.pause);
                    }
                }
            }

            function dropdownRowOffsetHeight(row) {
                var css = getComputedStyle(row);
                return row.offsetHeight + parseInt(css.marginTop, 10) + parseInt(css.marginBottom, 10);
            }

            function dropdownHeight() {
                return dd.getBoundingClientRect().top + parseInt(getComputedStyle(dd).maxHeight, 10);
            }

            function dropdownRow() {
                return elem[0].querySelectorAll('.autocomplete-row')[scope.currentIndex];
            }

            function dropdownRowTop() {
                return dropdownRow().getBoundingClientRect().top -
                    (dd.getBoundingClientRect().top +
                        parseInt(getComputedStyle(dd).paddingTop, 10));
            }

            function dropdownScrollTopTo(offset) {
                dd.scrollTop = dd.scrollTop + offset;
            }

            function updateInputField() {
                var current = scope.results[scope.currentIndex];
                if (scope.matchClass) {
                    inputField.val(extractTitle(current.originalObject));
                } else {
                    inputField.val(current.title);
                }
            }

            function keydownHandler(event) {
                var which = ie8EventNormalizer(event),
                    row = null,
                    rowTop = null;
                if (which === KEY_EN && scope.results) {
                    if (scope.currentIndex >= 0 && scope.currentIndex < scope.results.length) {
                        event.preventDefault();
                        scope.selectResult(scope.results[scope.currentIndex]);
                    } else {
                        event.preventDefault();
                        $timeout.cancel(searchTimer);
                        getRemoteResults(scope.searchStr);
                    }
                    scope.$apply();
                } else if (which === KEY_DW && scope.results) {
                    event.preventDefault();
                    if ((scope.currentIndex + 1) < scope.results.length && scope.showDropdown) {
                        scope.$apply(function () {
                            scope.currentIndex = scope.currentIndex + 1;
                            updateInputField();
                        });
                        if (isScrollOn) {
                            row = dropdownRow();
                            if (dropdownHeight() < row.getBoundingClientRect().bottom) {
                                dropdownScrollTopTo(dropdownRowOffsetHeight(row));
                            }
                        }
                    }
                } else if (which === KEY_UP && scope.results) {
                    event.preventDefault();
                    if (scope.currentIndex >= 1) {
                        scope.$apply(function () {
                            scope.currentIndex = scope.currentIndex - 1;
                            updateInputField();
                        });
                        if (isScrollOn) {
                            rowTop = dropdownRowTop();
                            if (rowTop < 0) {
                                dropdownScrollTopTo(rowTop - 1);
                            }
                        }
                    } else if (scope.currentIndex === 0) {
                        scope.$apply(function () {
                            scope.currentIndex = -1;
                            inputField.val(scope.searchStr);
                        });
                    }
                } else if (which === KEY_ES) {
                    // This is very specific to IE10/11 #272
                    // without this, IE clears the input text
                    event.preventDefault();
                }
            }

            function checkExactMatch(result, obj, str) {
                var key;
                if (!str) {
                    return false;
                }
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (obj[key].toLowerCase() === str.toLowerCase()) {
                            scope.selectResult(result);
                            return true;
                        }
                    }
                }
                return false;
            }

            function showAll() {
                if (scope.localData) {
                    scope.searching = false;
                    processResults(scope.localData, '');
                } else {
                    scope.searching = true;
                    getRemoteResults('');
                }
            }
            scope.mouseup = function (e) {
                scope.scroll = false;
            };
            scope.mousedown = function (e) {
                scope.scroll = true;
            };
            scope.hideResults = function (e) {
                if ((mousedownOn && (mousedownOn === scope.id + '_dropdown' || mousedownOn.indexOf('autocomplete') >= 0)) || scope.scroll) {
                    mousedownOn = null;
                } else {
                    hideTimer = $timeout(function () {
                        //clearResults();
                        scope.showDropdown = false;
                        scope.$apply(function () {
                            if (scope.searchStr && scope.searchStr.length > 0) {
                                inputField.val(scope.searchStr);
                            }
                        });
                    }, BLUR_TIMEOUT);
                    cancelHttpRequest();
                }
            };
            scope.hoverRow = function (index) {
                scope.currentIndex = index;
            };
            scope.viewAll = function () {
                shareData.sacResults = scope.results;
                shareData.searchStr = scope.searchStr;
                shareData.dataObject = scope.dataObject;
                //console.log(scope);
                $location.path(scope.viewAllUrl);
                //"/auth/goods-services/select-sac"

                //$window.parentScope =scope;
                //$popup = $window.open("/pages/registration/gs-popup.html", "popup", "width=990,height=450,left=20,top=150");
            };
            scope.selectResult = function (result) {
                if (scope.matchClass) {
                    result.title = extractTitle(result.originalObject);
                    result.description = extractValue(result.originalObject, scope.descriptionField);
                }
                if (scope.clearResultAfterSelect === 'true' || scope.clearResultAfterSelect === true) {
                    scope.searchStr = "";
                } else {
                    scope.searchStr = result.description;
                }
                //callOrAssign(result.originalObject);
                clearResults();
                scope.selectedResult = true;
                scope.afterSelect({
                    'result': result.originalObject
                });
            };
            scope.resetField = function () {
                scope.selectedResult = false;
                scope.searchStr = "";
                scope.resetResults();
            };
            scope.inputChangeHandler = function (str) {
                if (str.length < minlength) {
                    cancelHttpRequest();
                    clearResults();
                } else if (str.length === 0 && minlength === 0) {
                    scope.searching = false;
                    showAll();
                }
                return str;
            };
            // check min length
            if (scope.minlength && scope.minlength !== '') {
                minlength = parseInt(scope.minlength, 10);
            }
            // set strings for "Searching..." and "No results"
            scope.textSearching = "Searching..";
            scope.textNoResults = "No Results Found";
            displaySearching = scope.textSearching === 'false' ? false : true;
            displayNoResults = scope.textNoResults === 'false' ? false : true;
            // set max length (default to maxlength deault from html
            scope.maxlength = attrs.maxlength || 10;
            // register events
            inputField.on('keydown', keydownHandler);
            inputField.on('keyup', keyupHandler);
            // set isScrollOn
            $timeout(function () {
                var css = getComputedStyle(dd);
                isScrollOn = css.maxHeight && css.overflowY === 'auto';
            });
        }
        return {
            restrict: 'EA',
            //require: '^?form',
            scope: {
                dataObject: '=',
                id: '@',
                type: '@',
                placeholder: '@',
                remoteUrl: '@',
                titleField: '@',
                descriptionField: '@',
                pause: '@',
                minlength: '@',
                matchClass: '@',
                inputName: '@',
                afterSelect: '&',
                resetResults: '&',
                clearResultAfterSelect: '@',
                localData: '=',
                viewAllUrl: '@',
                showViewAll: '@',
                disableAfterSelect: '@',
                dropdownSearch: '@'
            },
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || TEMPLATE_URL;
            },
            compile: function (tElement) {
                var startSym = $interpolate.startSymbol(),
                    endSym = $interpolate.endSymbol(),
                    interpolatedHtml;
                if (!(startSym === '{{' && endSym === '}}')) {
                    interpolatedHtml = tElement.html().replace(/\{\{/g, startSym).replace(/\}\}/g, endSym);
                    tElement.html(interpolatedHtml);
                }
                return link;
            }
        };
    }
]);

myApp.directive('attachEvc', ['ajax', '$compile', '$timeout', function (ajax, $compile, $timeout) {
    function link(scope, elem, attrs) {
        scope.submit = function () {
            if (scope.submitCk()) {
                //checking form completion
                scope.callEVC();
            }
        };
        scope.setErr = function (msg, type) {
            switch (type) {
                case "error":
                    scope.errtype = "danger";
                    break;
                case "warning":
                    scope.errtype = "warning";
                    break;
                case "success":
                    scope.errtype = "success";
                    break;
            }
            if (msg == "") {
                delete scope.err;
            } else {
                scope.err = msg;
            }
        };
        scope.submitEVC = function () {
            if (!scope.otp || scope.otp == '') {
                scope.setErr("Please enter OTP", 'error');
                return;
            } else if (!/^[a-zA-Z0-9]{6}$/.test(scope.otp)) {
                scope.setErr("Invalid OTP entered", 'error');
                return;
            } else {
                scope.setErr("");
            }
            ajax.post(scope.signUrl, {
                "otp": scope.otp,
                "dataToSign": scope.rPayload,
                "formType": scope.formType,
                "tranId": scope.msg,
                "userId": scope.tranId
            }, {}, function () {
                scope.setErr("Please wait, validating OTP..", 'warning');
            }).then(function (resp) {
                if (resp.stscd == "0") {
                    scope.setErr(resp.message, 'error');
                } else {
                    scope.reset();
                    scope.callBack({
                        'data': resp
                    });
                }
            }, function () {
                scope.reset();
                scope.setErr("Unable to submit form. Please try again.", 'error');
            })
        };
        scope.reset = function () {
            scope.otp = "";
            $("#otpPrompt").modal('hide');
            $(".modal-backdrop").remove();
        };
        scope.callEVC = function () {
            $("#otpPrompt").modal({
                show: true,
                backdrop: 'static'
            });
            $timeout(function () {
                $("#otpinput").focus();
            }, 400);
            ajax.post(scope.otpUrl, {
                "formType": scope.formType,
                "tranId": scope.tranId,
                "userName": scope.username,
                "email": scope.email,
                "mobNo": scope.mobileno
            }, {}, function () {
                scope.setErr("Please wait, generating OTP..", 'warning');
            }).then(function (resp) {
                if (resp.stscd && resp.stscd == "1") {
                    scope.setErr("OTP has been sent to your Email and Mobile number registered at the GST portal", 'success');
                    scope.msg = resp.message;
                } else {
                    scope.setErr("Unable to generate OTP. Please try again.", 'error');
                }
            }, function (err) {
                scope.setErr("Unable to generate OTP. Please try again.", 'error');
            });
        };
    }
    return {
        restrict: 'A',
        scope: {
            "signUrl": "@",
            "otpUrl": "@",
            "rPayload": "@",
            "callBack": "&",
            "submitCk": "&",
            "formType": "@",
            "tranId": "@",
            "username": "@",
            "email": "@",
            "mobileno": "@"
        },
        compile: function (tElement) {
            return link;
        },
        template: function (ele, attrs, scope) {
            return "<button type='button' class='btn btn-primary' data-ng-click='submit()'>Submit with EVC</button><div id='otpPrompt' class='modal fade text-left' role='dialog'><div class='modal-dialog'><div class='modal-content'><div class='modal-header'><h4 class='modal-title'>OTP Verification</h4></div><div class='modal-body'><label class='reg'>Please enter OTP</label><input name='otp' id='otpinput' class='form-control upper-input' data-capitalize='' data-ng-model='otp' maxlength='6' autofocus><div class='alert alert-{{errtype}} rowtp-mar' data-ng-if='err'><p data-ng-bind='err'></p></div></div><div class='modal-footer'><button type='button' class='btn btn-default' data-ng-click='reset()'>Close</button><button type='button' data-ng-click='submitEVC()' class='btn btn-primary'>Validate OTP</button></div></div></div></div>";
        }
    };
}]);
myApp.directive("attachEsign", ['ajax', 'utilFunctions', '$compile', 'shareData', '$location', '$timeout', function (ajax, utilFunctions, $compile, shareData, $location, $timeout) {
    function esign(scope, elem, attrs) {
        scope.reset = function () {
            scope.service = false;
            scope.submitForm = false;
            delete scope.provid;
            delete scope.isAgreed;
            scope.setErr("");
            $('#serviceselect').modal('hide');
        }
        scope.validateForm = function () {
            if (scope.submitCk()) {
                scope.reset();
                scope.aadharmodal();
            }
        };
        scope.provdecl = function (data) {
            scope.setErr("");
            scope.nprovider = data;
        };
        scope.setErr = function (msg, type) {
            switch (type) {
                case "error":
                    scope.errtype = "danger";
                    break;
                case "warning":
                    scope.errtype = "warning";
                    break;
                case "success":
                    scope.errtype = "success";
                    break;
            }
            if (!msg || msg == "") {
                delete scope.err;
            } else {
                scope.err = msg;
            }
        };
        scope.otpGen = function () {
            if (!scope.provid || scope.provid == '') {
                scope.setErr("Service Provider is mandatory", 'error');
                return;
            } else if (!scope.isAgreed || scope.isAgreed == '') {
                scope.setErr("Kindly accept the declaration to proceed", 'error');
                return;
            } else {
                scope.setErr("");
            }
            var params = {
                "aadhaarNo": scope.aadharNumber,
                "isAgreed": scope.isAgreed,
                "provider": scope.provid,
                "formType": scope.formType,
                "intTransId": scope.tranId
            }
            ajax.post(scope.otpUrl, params, {}, function () {
                $().blockPage(true);
                scope.setErr("Please wait...", 'warning');
            }, function () {
                $().blockPage(false);
            }).then(function (response) {
                scope.otpcode = '';
                if (response.stscd == "1" || response.status == "1") {
                    scope.submitForm = true;
                    scope.service = false;
                    scope.modalHeader = 'Verify Aadhaar OTP';
                    scope.setErr("");
                    $timeout(function () {
                        $('#user_name').focus();
                    }, 100);
                } else {
                    $().blockPage(false);
                    scope.setErr(response.message, 'error');
                    if (response.errorDetail) scope.setErr(response.errorDesc, 'error');
                }
            }, function () {
                $().blockPage(false);
                scope.setErr("Unable to generate OTP. Please try again.", 'error');
            });
        }
        elem.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                event.preventDefault();
            }
        });
        scope.continueotp = function () {
            if (!scope.otpcode || scope.otpcode == '') {
                scope.setErr("Please enter OTP", 'error');
                return;
            } else {
                scope.setErr("");
            }
            var param = {
                "provider": scope.provid,
                "otp": scope.otpcode,
                "aadhaarNo": scope.aadharNumber,
                "dataToSign": scope.rPayload,
                "formType": scope.formType,
                "intTransId": scope.tranId
            };
            ajax.post(scope.esignSubmit, param, {}, function () {
                $().blockPage(true);
                scope.setErr("Please wait...", 'warning');
            }, function () {
                $().blockPage(false);
            }).then(function (response) {
                if (response.stscd == "0" || response.status == "0") {
                    scope.setErr(response.message || 'Unable to submit form. Please try again.', 'error');
                    if (response.errorDetail) {
                        if (response.errorDetail.errorCd == 'K-100') {
                            scope.setErr("Invalid OTP. Kindly enter valid OTP.", 'error');
                        } else {
                            scope.setErr("Unable to submit form. Please try again.", 'error');
                        }
                    }
                } else {
                    $().blockPage(false);
                    scope.reset();
                    scope.callBack();
                }
            }, function () {
                //error handling
                $().blockPage(false);
                scope.reset();
                scope.callBack();
                scope.setErr("Unable to submit form. Please try again.", 'error');
            });
        }
        scope.destroyDialg = function () {
            utilFunctions._destroyDialogue();
        }
        scope.aadharmodal = function () {
            if (scope.aadharNumber !== '') {
                $('#serviceselect').modal('show');
                scope.service = true;
                scope.modalHeader = 'Service Provider';
            } else {
                //error handling
                var errMsg = utilFunctions.createDialogue({
                    "type": "Warning",
                    "title": "Warning",
                    "message": "Please Update Aadhaar",
                    "callback": "destroyDialg()",
                    "ok_btn_title": "Ok",
                    "cancel_btn_title": "Cancel"
                });
                $('body').append($compile(errMsg)(scope));
                $("#confirmDlg").modal('show');
            }
        }
    }
    return {
        restrict: 'A',
        scope: {
            "submitCk": "&",
            "rPayload": "@",
            "aadharNumber": "=",
            "otpUrl": "=",
            "esignSubmit": "=",
            "callBack": "&",
            "provider": "=",
            "formType": "@",
            "tranId": "@"
        },
        compile: function (tElement) {
            return esign;
        },
        template: "<button class='btn btn-primary' ng-click='validateForm()' data-ng-disabled='!aadharNumber || aadharNumber==\"\"'>Submit with E-signature</button><div id='serviceselect' class='modal fade' role='dialog' data-backdrop='static'><div class='modal-dialog modal-md'><div class='modal-content'><div class='modal-header'><h4 class='modal-title text-center' data-ng-bind='modalHeader'></h4></div><div class='modal-body'><div class='row' style='background-color:white'><div class='col-sm-12 text-left'><div class='radio-order' data-ng-show='service'><label class='reg m-cir'>Please select Service Provider</label><div data-ng-repeat='prov in provider'><input type='radio' name='sprovider' class='form-control' id='{{prov.c}}' data-ng-click='provdecl(prov.n)' value='{{prov.c}}' data-ng-model='$parent.provid'><label for='{{prov.c}}'>{{prov.n}}</label></div><div class='text-justify' data-ng-show='provid'><input type='checkbox' class='chkbx' id='decl' name='decl' data-ng-model='isAgreed' data-radio-chkbx='' data-ng-click='setErr()'><label for='decl'>I hereby agree to authenticate myself using AADHAAR through <span ng-bind='nprovider'></span> e-sign services and affix my digital signature generated through eSign services provided by <span ng-bind='nprovider'></span> on the enrolment application form.</label></div></div><div data-ng-show='submitForm'><p class='text-justify'>OTP has been sent to your mobile number and email address registered with AADHAAR. Please provide your OTP.</p><input class='form-control' id='user_name' type='text' name='user_name' data-capitalize='' ng-model='otpcode' ng-change='setErr()' maxlength='6' autofocus></div><div class='alert alert-{{errtype}} rowtp-mar' data-ng-if='err'><p data-ng-bind='err'></p></div></div></div></div><div class='modal-footer'><button type='button' class='btn btn-default' type='button' data-dismiss='modal' id='closeModel'>Cancel</button><button type='button' class='btn btn-primary' type='button' data-ng-click='otpGen()' data-ng-if='service'>Continue</button><button type='button' class='btn btn-primary' type='button' data-ng-click='continueotp()' data-ng-if='submitForm'>Submit</button></div></div></div></div>"
    };
}]);
myApp.directive("videoPlayer", ["$compile", function ($compile) {
    function link(scope, elem, attrs) {
        scope.toggleVideo = function () {
            scope.toggleToVideo = true;
            setTimeout(function () {
                var vid = document.getElementById("myVideo");
                vid.src = "https:" + scope.videoUrl;
                vid.play();
            })
        }
    }
    return {
        restrict: 'E',
        scope: {
            "posterUrl": "@",
            "videoUrl": "@",
            "height": "@",
            "width": "@",
            "class": "@"
        },
        compile: function (tElement) {
            return link;
        },
        template: '<div data-ng-if="!toggleToVideo" class="video-img-container {{class}}" data-ng-click="toggleVideo()"><img ng-src="https:{{posterUrl}}" width="{{width}}" height="{{height}}"/><div class="video-img-i-container"><i class="fa player-play fa-youtube-play fa-5x"></i></div></div><video data-ng-if="toggleToVideo" id="myVideo" controls controlsList="nodownload" preload="metadata" width="{{width}}" height="{{height}}">Your browser does not support the video tag.</video>'
    };
}])
myApp.directive('attachDsc', ['ajax', 'utilFunctions', '$compile', '$timeout',
    function (ajax, utilFunctions, $compile, $timeout) {

        function link(scope, elem, attrs) {
            //console.log("inside directive")
            scope.validateForm = function () {
                if (scope.submitCk()) {
                    //alert()
                    scope.callDSC();
                }
                utilFunctions._destroyDialogue();
            };
            scope.callDSC = function () {
                scope.waitMessage = "Connecting..";
                scope.resClass = "alert-warning";
                scope.disableEle = true;
                scope.loadingEle = true;
                scope.dscAction = function (dhash) {
                    scope.signData = "action=sign" +
                        "\ntobesigned=" + dhash +
                        "\npanNo=" + scope.panAuth +
                        "\nsigntype=1" +
                        "\nexpirycheck=true" +
                        "\nissuername=" +
                        "\ncertclass=2|3" +
                        "\ncerttype=DSC" +
                        "\ncertdetails=";
                    scope.connection.send(scope.signData);
                    scope.connection.onmessage = function (resp) {
                        if (resp.data === "signing canceled" || resp.data === "signing failed") {
                            $().blockPage(false);
                            //console.log("WebSocket Closed");
                            scope.$apply(function () {
                                scope.setError("Signing Cancelled");
                            });
                        } else if (resp.data.indexOf("status = success") > -1) {
                            //console.log("Opened");
                            $().blockPage(false);
                        } else {
                            if (resp.data.substring(11, (resp.data.indexOf("SerialNo") - 1)) != "") {
                                var params = {
                                    "hContent": dhash,
                                    "emSignData": resp.data.substring(11, (resp.data.indexOf("SerialNo") - 1)),
                                    "pan": scope.panAuth,
                                    "refNum": Math.floor((Math.random() * 10000)),
                                    "formJson": scope.rPayload
                                };
                                ajax.post(scope.signUrl, params, {}, function () {
                                    scope.waitMessage = "Please wait..";
                                    scope.resClass = "alert-warning";
                                    $().blockPage(true);
                                }).then(function (response) {
                                    $().blockPage(false);
                                    if (response.stscd === "SUCCESS") {
                                        //console.log("success");
                                        scope.waitMessage = response.message;
                                        scope.resClass = "alert-success";
                                        scope.disableEle = true;
                                        scope.successCallBack({
                                            'data': response
                                        });
                                    } else {
                                        scope.setError(response.message);
                                    }
                                }, function () {
                                    scope.setError("We are facing technical issues. Please try again");
                                });
                            } else {
                                scope.setError("Sorry, No valid digital signatures found. Please try again");
                            }
                        }
                    };
                };
                scope.setError = function (msg) {
                    $().blockPage(false);
                    $timeout(function () {
                        scope.waitMessage = msg || "System error occured.";
                        scope.disableEle = false;
                        scope.resClass = "alert-danger";
                    }, 100);
                };
                ajax.post(scope.userAuth, {
                    "pan": scope.panAuth
                }, {}, function () {
                    $().blockPage(true);
                    scope.waitMessage = "Connecting to server";
                }).then(function (data) {
                    if (data.stscd === "FAILURE") {
                        scope.waitMessage = "The DSC you are trying to affix is not registered on the portal. Please use another DSC which is already registered or register the new DSC and then affix it.";
                        scope.disableEle = false;
                        scope.resClass = "alert-danger";
                        $().blockPage(false);
                    } else {
                        scope.waitMessage = "Retrieving installed digital signatures.. ";
                        scope.resClass = "alert-warning";
                        var hash = scope.callBack();
                        hash.then(function (dhash) {
                            if (!scope.connection) {
                                $().blockPage(true);
                                utilFunctions.connectEmsigner().then(function (conn) {
                                    scope.connection = conn;
                                    scope.dscAction(dhash);
                                }, function (err) {
                                    $().blockPage(false);
                                    if (err.status && err.status === "500") {
                                        scope.waitMessage = "Please install and use the correct EMSigner. The software can be downloaded from System Requirements page, link given in footer.";
                                    } else {
                                        scope.waitMessage = "Unable to connect to the installed EMSigner. Please close any other application running on following ports 1585, 2095, 2568, 2868, 4587 and restart your system, and try again.";
                                    }
                                    scope.disableEle = false;
                                    scope.resClass = "alert-danger";
                                });
                            } else {
                                $().blockPage(true);
                                scope.dscAction(dhash);
                            }

                        }, function () {
                            scope.waitMessage = "Failed to generate hash, try again";
                            scope.disableEle = false;
                            scope.resClass = "alert-danger";
                            $().blockPage(false);
                        });
                    }
                }, function (err) {
                    $().blockPage(false);
                    scope.waitMessage = "Error occured. Please try again";
                    scope.disableEle = false;
                    scope.resClass = "alert-danger";
                });
                return;

            };
            elem.on('click', function (e) {
                utilFunctions._destroyDialogue();
                $timeout(function () {
                    var conf = utilFunctions.createDialogue({
                        "type": "Warning",
                        "title": "Warning",
                        "message": "These informations are being collected under the Provisions of the Proposed Goods and Services Tax Act, 2017. Since All filled information along with annexure are subject to verification in the GST regime, therefore, in case of misleading / wrong / incorrect information with / without evidence shall attract provisions of cancellation as per the Provisions of Proposed Goods and Services Tax Act, 2017",
                        "callback": "validateForm()",
                        "ok_btn_title": "Proceed",
                        "cancel_btn_title": "Cancel"
                    });
                    $('body').append($compile(conf)(scope));
                    $("#confirmDlg").modal('show');
                }, 600);
                e.preventDefault();
                e.stopPropagation();
                return;
                //scope.loadingEle = true;
                //scope.disableEle = false;

            });
            //        }
        }
        return {
            restrict: 'A',
            scope: {
                "signUrl": "=",
                "panAuth": "=",
                "userAuth": "=",
                "loadingEle": "=",
                "disableEle": "=",
                "waitMessage": "=",
                "resClass": "=",
                "rPayload": "=",
                "callBack": "&",
                "successCallBack": "&",
                "submitCk": "&"
            },
            compile: function (tElement) {
                return link;
            }
        };
    }
]);
/*
myApp.factory('resolves', ["$q", "$http", "servers", function ($q, $http, servers) {
    var promises = [];
    return {
        ready: function () {
            //return $q.all(promises);
            if (servers) {
                var def = $q.defer();
                $http.get("props").success(function (data) {
                    def.resolve(data);
                });
                return def.promise;
            }
        }
    };
}]);
// This will boostrap the application but not run the compilation until
// the resolves have all resolved.
angular.asyncBootstrap = function (element, modules) {
    element = angular.element(element);
    modules = modules || [];
    modules.unshift(['$provide', function ($provide) {
        $provide.value('$rootElement', element);
    }]);
    modules.unshift('ng');
    var $injector = angular.injector(modules);

    $injector.invoke(["$rootElement", "$rootScope", "$compile", "resolves", "servers", function ($rootElement, $rootScope, $compile, resolves, servers) {
        $rootScope.$apply(function () {
            if (servers === false || servers === undefined) {
                $rootElement.data('$injector', $injector);
                $compile($rootElement)($rootScope);
            } else {
                resolves.ready().then(function (data) {
                    if (servers) {
                        $().setServers(data);
                        $rootScope.servers = data;
                    }
                    $rootElement.data('$injector', $injector);
                    $compile($rootElement)($rootScope);
                });
            }
        });
    }]);
};
*/
myApp.directive('capitalize', function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {

            var capitalize = function (inputValue) {
                switch (attrs.capitalize) {
                    case "toUpperCaseFirstChar":
                        return (inputValue || '').toUpperCaseFirstChar();
                    case "toLowerCaseFirstChar":
                        return (inputValue || '').toLowerCaseFirstChar();
                    case "toUpperCaseEachWord":
                        return (inputValue || '').toUpperCaseEachWord();
                    case "toLowerCaseEachWord":
                        return (inputValue || '').toLowerCaseEachWord();
                    case "toCamelCase":
                        return (inputValue || '').toCamelCase();
                    case "toUpperCase":
                        return (inputValue || '').toUpperCase();
                    case "toLowerCase":
                        return (inputValue || '').toLowerCase();
                    default:
                        return (inputValue || '').toUpperCase();
                }
            };
            if (ngModel) {
                ngModel.$formatters.push(capitalize);
                ngModel._$setViewValue = ngModel.$setViewValue;
                ngModel.$setViewValue = function (val) {
                    ngModel._$setViewValue(capitalize(val));
                    ngModel.$render();
                };
            } else {
                element.val(capitalize(element.val()));
                element.on("keypress keyup", function () {
                    scope.$evalAsync(function () {
                        element.val(capitalize(element.val()));
                    });
                });
            }
        }
    };
});

myApp.directive('format', ['$filter', '$locale', function ($filter, $locale) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) {
                return;
            }

            ctrl.$formatters.unshift(function (a) {
                $locale.NUMBER_FORMATS.PATTERNS[1].gSize = 2;
                if (attrs.format && attrs.format.length > 0) {
                    return $filter(attrs.format)(ctrl.$modelValue, '', attrs.fraction); // removed ₹ symbol as param for ICR 17052
                }
                return ctrl.$modelValue;
            });
            ctrl.$parsers.push(function (input) {
                var myval = input;
                var patt15 = /^(\-?(\d{0,11})(\.\d{0,2})?)$/
                //var totalpatt= new RegExp("^(\-?(\d{0,15}|\d{0,11})(\.\d{0,2})?)$");
                if (attrs.id === 'invval') {
                    var patt15 = /^(\-?(\d{0,13})(\.\d{0,2})?)$/
                }

                if (patt15.test(myval)) {
                    var patt = new RegExp("₹");
                    if (patt.test(myval)) {
                        myval = myval.replace(/\,|₹/g, '');
                    }

                    var myval = myval.toString();

                    if (myval.split('.')[0].length > 11 && attrs.id !== 'invval') {
                        ctrl.$setViewValue(ctrl.$modelValue);
                        ctrl.$render();
                        return ctrl.$modelValue;
                    }
                    else if (myval.split('.')[0].length > 15 && attrs.id === 'invval') {
                        ctrl.$setViewValue(ctrl.$modelValue);
                        ctrl.$render();
                        return ctrl.$modelValue;
                    }
                    else {
                        ctrl.$render();
                        return myval;
                    }
                }
                else {
                    ctrl.$setViewValue(ctrl.$modelValue);
                    ctrl.$render();
                    return ctrl.$modelValue;
                }
            });
            elem.bind('keypress', function (e) {
                var key = e.keyCode || e.charCode || 0;
                if (key === 46 && parseInt(attrs.fraction, 10) === 0) {
                    e.preventDefault();
                    return false;
                }
                if (key === 46 && this.value.indexOf('.') >= 0) {
                    e.preventDefault();
                    return false;
                }
                if ($.inArray(key, [8, 9, 27, 13, 46]) !== -1 ||
                    // Allow: Ctrl+A, Command+A
                    (key === 65 && (e.ctrlKey === true || e.metaKey === true))) {
                    return;
                }
                //&& (e.keyCode < 96 || e.keyCode > 105)
                if (!attrs.isneg) {
                    if (e.altKey || e.shiftKey || (((key < 48 || key > 57)))) {
                        e.preventDefault();
                        return false;
                    }
                }
                else {
                    if (key !== 45) {
                        if (e.altKey || e.shiftKey || (((key < 48 || key > 57)))) {
                            e.preventDefault();
                            return false;
                        }
                    }
                }
                if (attrs.format.length == 0 && this.value > 100) {
                    e.preventDefault();
                    return false;
                }
            });
            elem.bind('focus', function (e) {
                if (parseFloat(ctrl.$modelValue) == 0) {
                    ctrl.$modelValue = '';
                    $(elem).val('');
                }
            });
            elem.bind('blur', function (event) {
                var plainNumber = elem.val().replace(/[^\d|\-+|\.+]/g, '');
                //elem.val($filter(attrs.format)(plainNumber, '₹', attrs.fraction));
                //$locale.NUMBER_FORMATS.PATTERNS[0].gSize = 2;
                $locale.NUMBER_FORMATS.PATTERNS[1].gSize = 2;
                scope.$apply(function () {
                    var value1 = parseFloat(plainNumber);
                    if (!isNaN(parseFloat(plainNumber).toFixed(attrs.fraction))) {
                        if (value1 >= 1000000000000000 && attrs.id === 'invval') {
                            var value = parseFloat(parseFloat(plainNumber).toFixed(attrs.fraction)) - 0.10;
                            ctrl.$setViewValue(value);
                        }
                        else {
                            ctrl.$setViewValue(parseFloat(plainNumber).toFixed(attrs.fraction));
                        }
                    }
                    else {
                        ctrl.$setViewValue("");
                    }

                    if (!isNaN(parseFloat(plainNumber).toFixed(attrs.fraction)) && attrs.format && attrs.format.length > 0) {
                        if (value1 >= 1000000000000000 && attrs.id === 'invval') {
                            var value = parseFloat(parseFloat(plainNumber).toFixed(attrs.fraction)) - 0.10;
                            elem.val($filter(attrs.format)(value.toString(), '', attrs.fraction));// removed ₹ symbol as param for ICR 17052
                        }

                        else {
                            elem.val($filter(attrs.format)(plainNumber, '', attrs.fraction));// removed ₹ symbol as param for ICR 17052
                        }

                    }
                    else {
                        elem.val($filter(attrs.format)(null, '', attrs.fraction));// removed ₹ symbol as param for ICR 17052
                    }

                });
            });

        }
    };
}]);





myApp.filter('words', function () {
    function isInteger(x) {
        return parseInt(x);
    }

    function fract(n) {
        //commented as this is a reserved function, resultled in minification failure...also not used
        //return int(String(n).split('.')[1] || 0);
    }
    return function (value) {
        function toWords(a) {
            if (0 > a || $().getConstant("PAYMENT_MAX_NUM") < a) {
                return "Number is out of range";
            }
            var b = "",
                c, d, e, f, g;
            c = Math.floor(a / 1E7);
            a -= 1E7 * c;
            d = Math.floor(a / 1E5);
            a -= 1E5 * d;
            f = Math.floor(a / 1E3);
            a -= 1E3 * f;
            g = Math.floor(a / 100);
            a %= 100;
            e = Math.floor(a / 10);
            a = Math.floor(a % 10);
            0 < c && (b += toWords(c) + " Crore ");
            0 < d && (b += ("" === b ? "" : " ") + toWords(d) + " Lakhs ");
            0 < f && (b += ("" === b ? "" : " ") + toWords(f) + " Thousand ");
            g && (b += ("" === b ? "" : " ") + toWords(g) + " hundred ");
            c = " One Two Three Four Five Six Seven Eight Nine Ten Eleven Twelve Thirteen Fourteen Fifteen Sixteen Seventeen Eightteen Nineteen".split(" ");
            d = "  Twenty Thirty Fourty Fifty Sixty Seventy Eighty Ninety".split(" ");
            if (0 < e || 0 < a) {
                2 > e ? b += c[10 * e + a] : (b += d[e], 0 < a && (b += "-" + c[a]));
            }
            "" == b && (b = "null");
            return b;
        }
        //if(value%1)

        if (value && isInteger(value) && !isNaN(value)) {
            return "Rupees " + toWords(value) + " Only";
        }


    };

});
myApp.directive('checkList', function () {
    return {
        scope: {
            checkList: '=',
            value: '@',
            chkAll: '='
        },
        link: function (scope, elem, attrs) {

            var handler = function (setup) {
                var checked = elem.prop('checked');

                var index = -1;
                if (!scope.checkList) {
                    scope.checkList = [];
                }
                index = scope.checkList.indexOf(scope.value);

                if (checked && index == -1) {
                    if (setup)
                        elem.prop('checked', false);
                    else scope.checkList.push(scope.value);
                } else if (!checked && index != -1) {
                    if (setup) elem.prop('checked', true);
                    else scope.checkList.splice(index, 1);
                }
            };

            var setupHandler = handler.bind(null, true);
            var changeHandler = handler.bind(null, false);

            elem.on('change', function () {
                scope.$apply(changeHandler);
                if (scope.checkList.length != 5 && scope.chkAll) {
                    scope.$apply(function () {
                        scope.chkAll = false;

                    });
                }
            });
            scope.$watch('checkList', setupHandler, true);
        }
    };
});
myApp.filter("ordinal", function () {
    return function (array, key, value) {
        if (!array) return [];
        return array.filter(function (i) {
            /*if(i[key] === value) {
                return i;
            }*/
            key.split(".").map(function (item) {
                if (i.hasOwnProperty(item)) {
                    i = i[item];
                }
            });
            if (i === value) {
                return i;
            }
        });
        return [];
    };
});
myApp.filter('numkeys', function () {
    return function (object) {
        if (!object) {
            return [];
        }
        return Object.keys(object);
    }
});
myApp.directive("captcha", function () {
    function link(scope, element, attrs) {
        angular.extend(scope.captchaObject, {
            refresh: function () {
                scope.refreshCaptcha();
            }
        });
        scope.setResetErr = function (vari, msg) {
            setTimeout(function () {
                scope.$apply(function () {
                    scope[vari] = msg;
                });
            }, 100);
        }
        scope.loadCaptcha = function () {
            var x = $(element).find('audio');
            $("#imgCaptcha").addClass("captcha-loading").removeClass("captcha");

            //scope.captcha_url = attrs.imgCaptchaUrl + "?rnd=" + Math.random();
            scope.captcha_url = "/services/captcha?rnd=" + Math.random();
            scope.setResetErr("captchaErr", "Loading CAPTCHA...");

            $("#imgCaptcha").on("load", function () {
                $(this).removeClass('captcha-loading').addClass("captcha");
                scope.setResetErr('captchaErr', undefined);
            });
            $("#imgCaptcha").on("error", function () {
                $(this).removeClass('captcha-loading').addClass("captcha");
                scope.setResetErr("captchaErr", "Unable to load CAPTCHA image. Please click refresh button to load.");
            });
        };
        scope.loadCaptcha();
        scope.play = function () {
            if (!scope.playAudio) {
                scope.playAudio = true;
                setTimeout(function () {
                    var x = $(element).find('audio');
                    x[0].src = "/services/audiocaptcha";
                }, 50);
            } else {
                var x = $(element).find('audio');
                x[0].play();
            }
            scope.setResetErr('playingCap', true);
            scope.setResetErr('captchaErr', "Loading/Playing audio");
            scope.played();
        }
        scope.played = function () {
            setTimeout(function () {
                $(element).find('audio').on("ended", function () {
                    scope.setResetErr('captchaErr', undefined);
                    scope.setResetErr('playingCap', false);
                });
                $(element).find('audio').on("error", function (evt) {
                    scope.setResetErr('captchaErr', "Unable to load audio, Please try again");
                    scope.setResetErr('playingCap', false);
                });
            }, 100);
        }
        scope.refreshCaptcha = function () {
            scope.playAudio = false;
            scope.setResetErr('playingCap', false);
            scope.loadCaptcha();
        }

    }
    return {
        restrict: 'A',
        scope: {
            captchaObject: "="
        },
        template: function (ele, attrs, scope) {
            return '<audio id="audioCap" ng-if="playAudio" autoplay></audio>' +
                '<table><tr><th rowspan="2"><img id="imgCaptcha" ng-src="{{captcha_url}}" /></th>' +
                '<th><button type="button" ng-click="play()" ng-disabled="playingCap"><i class="fa fa-volume-up"></i></button></th></tr>' +
                '<tr><td><button type="button" ng-click="refreshCaptcha()" ng-disabled="playingCap"><i class="fa fa-refresh"></i></button></td></tr></table>' +
                '<p class="err" ng-show="captchaErr" data-ng-bind="captchaErr"></p>';
        },
        compile: function () {
            return link;
        }
    }
});
myApp.factory('FormSubmitter', ["$rootScope", "$sce", "$compile", function ($rootScope, $sce, $compile) {
    return {
        submit: function (url, method, params) {
            $('body').append($compile("<data-form-submitter-directive></data-form-submitter-directive>")($rootScope));
            url = $sce.trustAsResourceUrl(url);
            $rootScope.$emit('form_submit', {
                url: url,
                method: method,
                params: params
            });
        }
    }
}])
myApp.directive('formSubmitterDirective', ["$timeout", "$rootScope", function ($timeout, $rootScope) {
    return {
        restrict: 'E',
        replace: true,
        template: '<form id="formm" action="{{ formData.url }}" method="{{ formData.method }}">' +
            '   <div ng-repeat="(key,val) in formData.params">' +
            '       <input type="hidden" name="{{ key }}" value="{{ val }}" />' +
            '   </div>' +
            '</form>',
        link: function ($scope, $element, $attrs) {
            $rootScope.$on('form_submit', function (event, data) {
                $scope.formData = data;
                $timeout(function () {
                    $element.submit();
                })
            })
        }
    }
}]);

//returns directives and filters
myApp.filter('INRPAY', function () {
    return function (input) {
        if (!isNaN(input)) {

            if (input === '0' || input === null) {
                return 0;
            }
            var result = input.toString().split('.');

            var lastThree = result[0].substring(result[0].length - 3);
            var otherNumbers = result[0].substring(0, result[0].length - 3);
            if (otherNumbers != '')
                lastThree = ',' + lastThree;
            var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
            if (result.length > 1) {
                if (result[1].length == 1) {
                    output += "." + result[1].substring(0, 1) + '0';
                }
                else {
                    output += "." + result[1].substring(0, 2);
                }
            }


            return output;
        }
    }
});


myApp.filter('INRDecimal', function () {
    return function (input) {
        if (!isNaN(input)) {

            if (input === '0' || input === null) {
                return 0;
            }

            //var output = Number(input).toLocaleString('en-IN');   <-- This method is not working fine in all browsers!           
            var result = input.toString().split('.');

            var lastThree = result[0].substring(result[0].length - 3);
            var otherNumbers = result[0].substring(0, result[0].length - 3);
            if (otherNumbers != '')
                lastThree = ',' + lastThree;
            var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

            if (output.length >= 15) {
                var showval = output.substring(0, 15) + '...';
                return showval
            }

            if (result.length > 1) {

                if (result[1].length == 1) {
                    output += "." + result[1].substring(0, 1) + '0';
                }
                else {
                    output += "." + result[1].substring(0, 2);
                }
            }
            else {
                output += ".00";
            }

            return output;
        }
    }
});
myApp.filter('INR', function () {
    return function (input, arg) {
        if (!isNaN(input)) {

            if (input === '0' || input === null) {
                return 0;
            }
            //var output = Number(input).toLocaleString('en-IN');   <-- This method is not working fine in all browsers!           
            var isNegative = parseFloat(input) < 0;
            input = Math.abs(parseFloat(input));
            var result = input.toString().split('.');
            var lastThree = result[0].substring(result[0].length - 3);
            //               console.log(lastThree.length)
            //                if(lastThree.length <= 3)
            //                    return lastThree+"."+result[1];
            var otherNumbers = result[0].substring(0, result[0].length - 3);
            if (otherNumbers != '')
                lastThree = ',' + lastThree;
            var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
            if (arg === 'ret') {
                if (output.length >= 15) {
                    var showval = output.substring(0, 15) + '...';
                    showval = (isNegative ? '-' : '') + showval;
                    return showval;
                }
            }
            if (result.length > 1) {
                if (result[1].length == 1) {
                    output += "." + result[1].substring(0, 1) + '0';
                }
                else {
                    output += "." + result[1].substring(0, 2);
                }
            }
            else {
                if (arg === 'pay') {
                    output = output;
                }
                else {
                    output += ".00";
                }
            }
            output = (isNegative ? '-' : '') + output;

            return output;
        }
    }
});


myApp.directive('percentage', function () {
    var link = function (scope, element, attrs, ngModel) {
        var parsePercentage = function (input) {
            var oldValue = ngModel.$modelValue;
            var inputFloat = parseFloat(input);
            if (isNaN(inputFloat)) {
                input = input.replace(/^([^0-9]*)$/, '');
                ngModel.$setViewValue(input);
                ngModel.$render();
                return input;
            }
            if (RegExp(/^\.?\d+\.?\d{0,2}$/).test(input) && inputFloat >= 0 && inputFloat <= 999.99 || input === '') {
                if (RegExp(/^((\d{0,3}|999.99)(\.\d{0,2})?)$/).test(input)) {
                    return inputFloat;
                }
                else {
                    input = input.replace(/^0+/, '');
                    ngModel.$setViewValue(input);
                    ngModel.$render();
                    return input;
                }
            } else {
                if (input.indexOf('..') > -1) {
                    ngModel.$setViewValue(oldValue + '.');
                }
                else {
                    ngModel.$setViewValue(oldValue || '');
                }
                ngModel.$render();
                return oldValue;
            }
        };

        var formatPercentage = function (val) {
            if (val && !isNaN(val)) {
                var str = String(val).split('.');
                str[0] = str[0] || '0';
                str[1] = str[1] || '00';
                val = str[0] + '.' + (str[1].length == 1 ? str[1] + '0' : str[1]) + ' %';
                return val;
            }
            return '0.00 %';
        };

        ngModel.$parsers.push(parsePercentage);
        ngModel.$formatters.push(formatPercentage);

        element.bind('blur', function () {
            if (!isNaN(ngModel.$modelValue) && parseFloat(ngModel.$modelValue) !== 0) {
                element.val(formatPercentage(ngModel.$modelValue));
            }
            else {
                element.val(formatPercentage(0));
                ngModel.$setViewValue(0);
                scope.$apply();
            }
        });
        element.bind('focus', function () {
            if (!isNaN(ngModel.$modelValue) && parseFloat(ngModel.$modelValue) !== 0) {
                element.val(ngModel.$modelValue);
            }
            else {
                element.val(null);
            }
        });
    };

    return {
        require: 'ngModel',
        restrict: 'A',
        link: link
    }
});
myApp.directive('hsnSac', function () {
    var link = function (scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function (input) {
            if (input == undefined)
                return '';

            var cleanInputValue = input.replace(/[^\d]/gi, '');
            cleanInputValue = cleanInputValue.length > 8 ? cleanInputValue.slice(0, -1) : cleanInputValue;

            if (cleanInputValue != input) {
                ngModel.$setViewValue(cleanInputValue);
                ngModel.$render();
            }
            if (cleanInputValue.length < 2) {
                return '';
            }
            return cleanInputValue;
        });
    }

    return {
        require: 'ngModel',
        restrict: 'A',
        link: link
    }
});

myApp.directive('noSpecialChar', function () {
    var link = function (scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function (inputValue) {
            if (inputValue == undefined)
                return ''
            var cleanInputValue = inputValue.replace(/[^\w\s]/gi, '');
            if (cleanInputValue != inputValue) {
                modelCtrl.$setViewValue(cleanInputValue);
                modelCtrl.$render();
            }
            return cleanInputValue;
        });
    };

    return {
        require: 'ngModel',
        restrict: 'A',
        link: link
    }
});


myApp.directive('totalfire', [function () {

    return {
        restrict: 'A',
        link: function ($scope, iElm, iAttrs, controller) {

            (iElm).on('keyup mouseleave', function () {
                $scope.addTotal();
                $scope.updateTotalAmount();

            });
        }
    };
}]);
myApp.directive("readjson", [function () {
    return {
        scope: {
            readjson: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.readjson = JSON.parse(loadEvent.target.result);
                    });
                }
                reader.readAsText(changeEvent.target.files[0]);
            });
        }
    }
}]);
myApp.directive('jsTree', ['$http', function ($http) {

    var treeDir = {
        restrict: 'EA',
        fetchResource: function (url, cb) {
            return $http.get(url).then(function (data) {
                if (cb) cb(data.data);
            });
        },

        managePlugins: function (s, e, a, config) {
            if (a.treePlugins) {
                config.plugins = a.treePlugins.split(',');
                config.core = config.core || {};
                config.core.check_callback = config.core.check_callback || true;

                if (config.plugins.indexOf('state') >= 0) {
                    config.state = config.state || {};
                    config.state.key = a.treeStateKey;
                }

                if (config.plugins.indexOf('search') >= 0) {
                    var to = false;
                    if (e.next().attr('class') !== 'ng-tree-search') {
                        e.after('<input type="text" placeholder="Search Tree" class="ng-tree-search"/>')
                            .next()
                            .on('keyup', function (ev) {
                                if (to) {
                                    clearTimeout(to);
                                }
                                to = setTimeout(function () {
                                    treeDir.tree.jstree(true).search(ev.target.value);
                                }, 250);
                            });
                    }
                }

                if (config.plugins.indexOf('checkbox') >= 0) {
                    config.checkbox = config.checkbox || {};
                    config.checkbox.keep_selected_style = false;
                }

                if (config.plugins.indexOf('contextmenu') >= 0) {
                    if (a.treeContextmenu) {
                        config.contextmenu = s[a.treeContextmenu];
                    }
                }

                if (config.plugins.indexOf('types') >= 0) {
                    if (a.treeTypes) {
                        config.types = s[a.treeTypes];
                    }
                }

                if (config.plugins.indexOf('dnd') >= 0) {
                    if (a.treeDnd) {
                        config.dnd = s[a.treeDnd];
                    }
                }
            }
            return config;
        },
        manageEvents: function (s, e, a) {
            if (a.treeEvents) {
                var evMap = a.treeEvents.split(';');
                for (var i = 0; i < evMap.length; i++) {
                    if (evMap[i].length > 0) {
                        // plugins could have events with suffixes other than '.jstree'
                        var evt = evMap[i].split(':')[0];
                        if (evt.indexOf('.') < 0) {
                            evt = evt + '.jstree';
                        }
                        var cb = evMap[i].split(':')[1];
                        treeDir.tree.on(evt, s[cb]);
                    }
                }
            }
        },
        link: function (s, e, a) { // scope, element, attribute \O/
            $(function () {
                var config = {};

                // users can define 'core'
                config.core = {};
                if (a.treeCore) {
                    config.core = $.extend(config.core, s[a.treeCore]);
                }

                // clean Case
                a.treeData = a.treeData ? a.treeData.toLowerCase() : '';
                a.treeSrc = a.treeSrc ? a.treeSrc.toLowerCase() : '';

                if (a.treeData == 'html') {
                    treeDir.fetchResource(a.treeSrc, function (data) {
                        e.html(data);
                        treeDir.init(s, e, a, config);
                    });
                } else if (a.treeData == 'json') {
                    treeDir.fetchResource(a.treeSrc, function (data) {
                        config.core.data = data;
                        treeDir.init(s, e, a, config);
                    });
                } else if (a.treeData == 'scope') {
                    s.$watch(a.treeModel, function (n, o) {
                        if (n) {
                            config.core.data = s[a.treeModel];
                            $(e).jstree('destroy');
                            treeDir.init(s, e, a, config);
                        }
                    }, true);
                    // Trigger it initally
                    // Fix issue #13
                    config.core.data = s[a.treeModel];
                    treeDir.init(s, e, a, config);
                } else if (a.treeAjax) {
                    config.core.data = {
                        'url': a.treeAjax,
                        'data': function (node) {
                            return {
                                'id': node.id != '#' ? node.id : 1
                            };
                        }
                    };
                    treeDir.init(s, e, a, config);
                }
            });

        },
        init: function (s, e, a, config) {
            treeDir.managePlugins(s, e, a, config);
            this.tree = $(e).jstree(config);
            treeDir.manageEvents(s, e, a);
        }
    };

    return treeDir;

}]);

//hsn,hsn validation,Add to master integeration 
myApp.directive('newAutocompleteHsn', ['$q', '$parse', '$http', '$sce', '$timeout', '$templateCache', '$interpolate', '$window', 'shareData', '$location',
    function ($q, $parse, $http, $sce, $timeout, $templateCache, $interpolate, $window, shareData, $location) {
        var KEY_DW = 40,
            KEY_RT = 39,
            KEY_UP = 38,
            KEY_LF = 37,
            KEY_ES = 27,
            KEY_EN = 13,
            MIN_LENGTH = 4,
            BLUR_TIMEOUT = 200;
        function link(scope, elem, attrs, ctrl) {
            var inputField = elem.find('input'),
                minlength = MIN_LENGTH,
                searchTimer = null,
                hideTimer, httpCanceller = null,
                dd = elem[0].querySelector('.autocomplete-dropdown'),
                isScrollOn = false,
                mousedownOn = null,
                displaySearching, displayNoResults, $popup, hideDisplayResutlts = false;
            scope.currentIndex = null;
            scope.searching = false;
            scope.selectedResult = false;
            // scope.errorMsg=null
            if (scope.showViewAll === "true" || scope.showViewAll === true) {
                scope.showViewAll = true;
            } else {
                scope.showViewAll = false;
            }

            function clickoutHandlerForDropdown(event) {
                mousedownOn = null;
                scope.hideResults(event);
                document.body.removeEventListener('click', clickoutHandlerForDropdown);
            }

            // for IE8 quirkiness about event.which
            function ie8EventNormalizer(event) {
                return event.which || event.keyCode;
            }

            function extractValue(obj, key) {
                var keys, result, i;
                if (key) {
                    keys = key.split('.');
                    result = obj;
                    for (i = 0; i < keys.length; i = i + 1) {
                        result = result[keys[i]];
                    }
                } else {
                    result = obj;
                }
                return result;
            }

            function extractTitle(data) {
                return scope.titleField.split(',').map(function (field) {
                    return extractValue(data, field);
                }).join(' ');
            }
            function extractProdTitle(data) {
                return scope.prodTitleField.split(',').map(function (field) {
                    return extractValue(data, field);
                }).join(' ');
            }

            function findMatchString(target, str) {
                var result, matches, re;
                re = new RegExp(str.replace(/[.*+?\^${}()|\[\]\\]/g, '\\$&'), 'i');
                if (!target) {
                    return;
                }
                if (!target.match || !target.replace) {
                    target = target.toString();
                }
                matches = target.match(re);
                if (matches) {
                    result = target.replace(re, '<span class="' + scope.matchClass + '">' + matches[0] + '</span>');
                } else {
                    result = target;
                }
                return $sce.trustAsHtml(result);
            }

            function initResults() {
                scope.showDropdown = displaySearching;
                scope.errorMsg = null;
                scope.currentIndex = -1;
                scope.results = [];
                scope.resultList = null;
            }

            function clearResults() {
                scope.showDropdown = false;
                scope.resultList = null;
                scope.results = [];
                if (dd) {
                    dd.scrollTop = 0;
                }
            }

            function filterResultByCodeLength(responseData, minCodeLength) {
                var regexPattern1Digit = /^[0-9]{1}$/;
                // filter only if minCodeLength is a digit between 0-9
                if (regexPattern1Digit.test(minCodeLength)) {
                    var minCodeLength = parseInt(minCodeLength, 10);
                    responseData = responseData.filter(function (element) {
                        return element.c.length >= minCodeLength;
                    });
                }
                return responseData;
            }

            //Product master integration

            function filterprodResultByCodeLength(responseData, minCodeLength) {
                var regexPattern1Digit = /^[0-9]{1}$/;
                // filter only if minCodeLength is a digit between 0-9
                if (regexPattern1Digit.test(minCodeLength)) {
                    var minCodeLength = parseInt(minCodeLength, 10);
                    responseData = responseData.filter(function (element) {
                        return element.hsn.length >= minCodeLength;
                    });
                }
                return responseData;
            }

            function processprodResults(responseData, str) {
                var i, description, text, formattedText, formattedDesc;
                // responseData = filterprodResultByCodeLength(responseData, scope.minCodeLengthToDisplay);

              //  console.log("responseData:", responseData)
                if (responseData && responseData.length > 0) {
                    scope.results = [];
                    for (i = 0; i < responseData.length; i = i + 1) {
                        if (scope.prodTitleField && scope.prodTitleField !== '') {
                            description = formattedDesc = extractProdTitle(responseData[i]);
                        }
                        description = '';
                        if (scope.prodDescriptionField) {
                            text = formattedText = extractValue(responseData[i], scope.prodDescriptionField);
                        }
                        if (scope.matchClass) {
                            formattedText = findMatchString(text, str);
                            formattedDesc = findMatchString(description, str);
                        }
                        scope.results[scope.results.length] = {
                            title: formattedText,
                            description: formattedDesc,
                            originalObject: responseData[i]
                        };
                    }
                    scope.results.sort(function(a,b){
                        return parseInt(a.description)-parseInt(b.description);
                    })
                } else {
                    scope.results = [];
                    scope.errorMsg = scope.textNoResults
                }
                if (scope.results.length === 0 && !displayNoResults) {
                    scope.showDropdown = false;
                } else if (hideDisplayResutlts) {
                    scope.showDropdown = false;
                }
                else {
                    scope.showDropdown = true;
                }
            }


            function processResults(responseData, str) {
                var i, description, text, formattedText, formattedDesc;
                scope.resultList = responseData;
                responseData = filterResultByCodeLength(responseData, scope.minCodeLengthToDisplay);
               // console.log("responseData:", responseData)
                if (responseData && responseData.length > 0) {
                    scope.results = [];
                    for (i = 0; i < responseData.length; i = i + 1) {
                        if (scope.titleField && scope.titleField !== '') {
                            text = formattedText = extractTitle(responseData[i]);
                        }
                        description = '';
                        if (scope.descriptionField) {
                            description = formattedDesc = extractValue(responseData[i], scope.descriptionField);
                        }
                        if (scope.matchClass) {
                            formattedText = findMatchString(text, str);
                            formattedDesc = findMatchString(description, str);
                        }
                        scope.results[scope.results.length] = {
                            title: formattedText,
                            description: formattedDesc,
                            originalObject: responseData[i]
                        };
                    }
                } else {
                    scope.results = [];
                    scope.errorMsg = scope.textNoResults
                }
                if (scope.results.length === 0 && !displayNoResults) {
                    scope.showDropdown = false;
                } else if (hideDisplayResutlts) {
                    scope.showDropdown = false;
                }
                else {
                    scope.showDropdown = true;
                }
            }

            function cancelHttpRequest() {
                if (httpCanceller) {
                    httpCanceller.resolve();
                    scope.showDropdown = false
                }
            }



            function getLocProdResults(str) {
                var i, match, s, value, matches, searchFields = [];
                // searchFields.push(scope.prodTitleField);
                searchFields.push(scope.prodDescriptionField);
                matches = [];
                if (scope.prodData) {
                    for (i = 0; i < scope.prodData.length; i = i + 1) {
                        match = false;
                        for (s = 0; s < searchFields.length; s = s + 1) {
                            value = extractValue(scope.prodData[i], searchFields[s]) || '';
                            match = match || (value.toString().toLowerCase().indexOf(str.toString().toLowerCase()) >= 0);
                        }

                        if (match) {
                            matches[matches.length] = scope.prodData[i];
                        }
                    }
                }
                //console.log("matches:", matches)
                return matches;
            }

            function getLocalResults(str) {
                var i, match, s, value, matches, searchFields = [];
                searchFields.push(scope.titleField);
                searchFields.push(scope.descriptionField);
                matches = [];
                for (i = 0; i < scope.localData.length; i = i + 1) {
                    match = false;
                    for (s = 0; s < searchFields.length; s = s + 1) {
                        value = extractValue(scope.localData[i], searchFields[s]) || '';
                        match = match || (value.toString().toLowerCase().indexOf(str.toString().toLowerCase()) >= 0);
                    }

                    if (match) {
                        matches[matches.length] = scope.localData[i];
                    }
                }

                return matches;
            }

            function getRemoteResults(str) {
                if (str === "" || str === undefined) {
                    scope.searching = false;
                    return;
                }
                var params = {
                    params: {
                        "q": str
                    }
                },
                    url = scope.remoteUrl;
                if (angular.isDefined(scope.secondUrl) && str.substr(0, 2) == "99") {
                    url = scope.secondUrl;
                }
                cancelHttpRequest();
                httpCanceller = $q.defer();
                params.timeout = httpCanceller.promise;
                $http.get(url + str)
                    .success(function (responseData) {
                        scope.searching = false;
                        processResults(extractValue(responseData, "data"), str);
                    }).error(function (err) {
                        scope.searching = false;
                    });
            }

            function searchTimerComplete(str) {
                if ((!str || str.length < minlength) && scope.dropdownSearch !== 'true') {
                    return;
                }
                var found = false;
                scope.viewMore = false;
                if (sessionStorage.getItem('supRecipGstin')) {
                    scope.prodData = JSON.parse(sessionStorage.getItem('supRecipGstin')).productsMasters;
                    // console.log("key up", scope.prodData)
                    //Logic - if we found hsn code then var found = true; else found = false;
                }
                setTimeout(function () {
                    scope.$apply(function () {
                        if (scope.showHsnTabs === 'false' || scope.showHsnTabs === false) {
                            var matches = getLocProdResults(str);
                            if (matches && matches.length > 0) {
                                found = true;
                                scope.searching = false;
                                clearResults();
                                processprodResults(matches, str);
                                scope.viewMore = true;
                            } else {
                                found = false;
                                scope.viewMore = false;
                                scope.rmlengthvalidation = false;
                                minlength = 2;
                            }
                        } else {
                            minlength = 2;
                        }
                        var pattern = new RegExp("^\\d{2,8}$");
                        if (!found && ((str.length >= minlength && pattern.test(str)) || (!pattern.test(str) && str.length >= Math.max(4, minlength)))) {
                            if (scope.localData) {
                                setTimeout(function () {
                                    scope.$apply(function () {
                                        var matches = getLocalResults(str);
                                        scope.searching = false;
                                        processResults(matches, str);
                                    });
                                });
                            } else {
                                getRemoteResults(str);
                            }
                        }
                        else if (!found) {
                            scope.descError = "Enter 2 digits/4 characters or more to search";
                            cancelHttpRequest();
                            clearResults();
                            scope.searching = false;

                        }

                    });
                });


            }
            scope.focusHandler = function () {
                if (!scope.showDropdown && scope.dropdownSearch === 'true') {
                    initResults();
                    scope.searchStr = "";
                    scope.searching = true;
                    searchTimerComplete(scope.searchStr);
                }
                hideDisplayResutlts = false;
            };

            function keyupHandler(event) {
                var which = ie8EventNormalizer(event);
                if (which === KEY_LF || which === KEY_RT) {
                    return;
                }
                if (which === KEY_UP || which === KEY_EN) {
                    event.preventDefault();
                } else if (which === KEY_DW) {
                    event.preventDefault();
                    if (!scope.showDropdown && scope.searchStr && scope.searchStr.length >= minlength) {
                        initResults();
                        scope.searching = true;
                        searchTimerComplete(scope.searchStr);
                    }
                } else if (which === KEY_ES) {
                    clearResults();
                    scope.$apply(function () {
                        inputField.val(scope.searchStr);
                    });
                }
                else {
                    var pattern = new RegExp("^\\d{2,8}$");
                    if (minlength === 0 && !scope.searchStr) {
                        return;
                    }
                    if ((!scope.searchStr || scope.searchStr === '') && scope.dropdownSearch !== 'true') {
                        scope.showDropdown = false;
                    } else if (scope.searchStr.length >= minlength && pattern.test(scope.searchStr)) {
                        initResults();
                        if (searchTimer) {
                            $timeout.cancel(searchTimer);
                        }
                        scope.searching = true;
                        searchTimer = $timeout(function () {
                            searchTimerComplete(scope.searchStr);
                        }, scope.pause);
                    }
                    else if (!pattern.test(scope.searchStr) && (scope.searchStr.length >= Math.max(4, parseInt(minlength)) || scope.rmlengthvalidation)) {
                        initResults();
                        if (searchTimer) {
                            $timeout.cancel(searchTimer);
                        }
                        scope.searching = true;
                        searchTimer = $timeout(function () {
                            searchTimerComplete(scope.searchStr);
                        }, scope.pause);
                    }
                }
            }

            function dropdownRowOffsetHeight(row) {
                var css = getComputedStyle(row);
                return row.offsetHeight + parseInt(css.marginTop, 10) + parseInt(css.marginBottom, 10);
            }

            function dropdownHeight() {
                return dd.getBoundingClientRect().top + parseInt(getComputedStyle(dd).maxHeight, 10);
            }

            function dropdownRow() {
                return elem[0].querySelectorAll('.autocomplete-row')[scope.currentIndex];
            }

            function dropdownRowTop() {
                return dropdownRow().getBoundingClientRect().top -
                    (dd.getBoundingClientRect().top +
                        parseInt(getComputedStyle(dd).paddingTop, 10));
            }

            function dropdownScrollTopTo(offset) {
                dd.scrollTop = dd.scrollTop + offset;
            }

            function updateInputField() {
                var current = scope.results[scope.currentIndex];
                if (scope.matchClass) {
                    inputField.val(extractTitle(current.originalObject));
                } else {
                    inputField.val(current.description);
                }
            }

            function keydownHandler(event) {
                var which = ie8EventNormalizer(event),
                    row = null,
                    rowTop = null;
                if (which === KEY_EN && scope.results) {
                    if (scope.currentIndex >= 0 && scope.currentIndex < scope.results.length) {
                        event.preventDefault();
                        scope.selectResult(scope.results[scope.currentIndex]);
                    } else {
                        event.preventDefault();
                        $timeout.cancel(searchTimer);
                        getRemoteResults(scope.searchStr);
                    }
                    scope.$apply();
                } else if (which === KEY_DW && scope.results) {
                    event.preventDefault();
                    if ((scope.currentIndex + 1) < scope.results.length && scope.showDropdown) {
                        scope.$apply(function () {
                            scope.currentIndex = scope.currentIndex + 1;
                            updateInputField();
                        });
                        if (isScrollOn) {
                            row = dropdownRow();
                            if (dropdownHeight() < row.getBoundingClientRect().bottom) {
                                dropdownScrollTopTo(dropdownRowOffsetHeight(row));
                            }
                        }
                    }
                } else if (which === KEY_UP && scope.results) {
                    event.preventDefault();
                    if (scope.currentIndex >= 1) {
                        scope.$apply(function () {
                            scope.currentIndex = scope.currentIndex - 1;
                            updateInputField();
                        });
                        if (isScrollOn) {
                            rowTop = dropdownRowTop();
                            if (rowTop < 0) {
                                dropdownScrollTopTo(rowTop - 1);
                            }
                        }
                    } else if (scope.currentIndex === 0) {
                        scope.$apply(function () {
                            scope.currentIndex = -1;
                            inputField.val(scope.searchStr);
                        });
                    }
                } else if (which === KEY_ES) {
                    // This is very specific to IE10/11 #272
                    // without this, IE clears the input text
                    event.preventDefault();
                }
            }

            function showAll() {
                if (scope.localData) {
                    scope.searching = false;
                    processResults(scope.localData, '');
                } else {
                    scope.searching = true;
                    getRemoteResults('');
                }
            }
            scope.mouseup = function (e) {
                scope.scroll = false;
            };
            scope.mousedown = function (e) {
                scope.scroll = true;
            };
            scope.hideResults = function (e) {
                scope.descError = null;
                if ((mousedownOn && (mousedownOn === scope.id + '_dropdown' || mousedownOn.indexOf('autocomplete') >= 0)) || scope.scroll) {
                    mousedownOn = null;
                } else {
                    hideTimer = $timeout(function () {
                        scope.showDropdown = false;
                        scope.errorMsg = null;
                        scope.$apply(function () {
                            if (scope.searchStr && scope.searchStr.length > 0) {
                                //
                                function altFind(arr, callback) {
                                    for (var i = 0; i < arr.length; i++) {
                                        var match = callback(arr[i]);
                                        if (match) {
                                            return arr[i];
                                        }
                                    }
                                }
                                const result = altFind(scope.results, function (e) { return e.description === scope.searchStr })
                                // const result = scope.results.find( ({ description }) => description === scope.searchStr  );
                                if (!result || result.length < 1) { scope.errorMsg = scope.textNoResults }
                                inputField.val(scope.searchStr);
                            }
                        });
                        scope.afterBlur();
                    }, BLUR_TIMEOUT);
                    cancelHttpRequest();
                }
            };

            scope.afterBlur = function () {
                hideDisplayResutlts = true;
                scope.onBlurred({ 'resultList': scope.resultList });

            }

            scope.hoverRow = function (index) {
                scope.currentIndex = index;
            };
            scope.viewAll = function () {
                shareData.sacResults = scope.results;
                shareData.searchStr = scope.searchStr;
                shareData.dataObject = scope.dataObject;
                $location.path(scope.viewAllUrl);
            };
            scope.showMoreHSN = function () {
                angular.element('#'+scope.id+'_value').focus();
                minlength = 2;
                scope.rmlengthvalidation = false;
                $timeout.cancel(searchTimer);
                scope.viewMore = false;
                clearResults();
                var pattern = new RegExp("\\d{2,8}$");
                if (pattern.test(scope.searchStr) || (!pattern.test(scope.searchStr) && scope.searchStr.length >= 4)) {
                    getRemoteResults(scope.searchStr);
                } else {
                    scope.descError = "Enter 2 digits/4 characters or more to search";
                }

            }
            scope.selectResult = function (result) {
                if (scope.matchClass) {
                    result.title = extractTitle(result.originalObject);
                    result.description = extractValue(result.originalObject, scope.descriptionField);
                }
                if (scope.clearResultAfterSelect === 'true' || scope.clearResultAfterSelect === true) {
                    scope.searchStr = "";
                } else {
                    scope.searchStr = result.description;
                }
                //callOrAssign(result.originalObject);
                clearResults();
                scope.selectedResult = true;
                scope.afterSelect({
                    'result': result.originalObject
                });
            };
            scope.resetField = function () {
                scope.selectedResult = false;
                scope.searchStr = "";
                scope.showDropdown = false;
                scope.resetResults();
                scope.prodDescriptionField = "productName";
            };
            scope.rmlengthvalidation = false;
            scope.inputChangeHandler = function (str) {
                scope.showDropdown = false;
                scope.errorMsg = false;
                scope.descError = null;
                scope.onHsnChange();
                if (sessionStorage.getItem('supRecipGstin')) {
                    scope.rmlengthvalidation = true;
                    minlength = 1;
                }
                var pattern = new RegExp("^\\d{2,8}$");
                if (str && str.length < minlength) {
                    scope.errorMsg = "Enter 2 digits/4 characters or more to search";
                    scope.descError = "Enter 2 digits/4 characters or more to search";
                    cancelHttpRequest();
                    clearResults();
                }
                else if (str && !pattern.test(str) && str.length < Math.max(4, minlength) && !scope.rmlengthvalidation) {
                    scope.descError = "Enter 2 digits/4 characters or more to search";
                    cancelHttpRequest();
                    clearResults();
                }
                else if (str && str.length === 0 && minlength === 0) {
                    scope.searching = false;
                    showAll();
                }
                return str;
            };
            // check min length
            if (scope.minlength && scope.minlength !== '') {
                minlength = parseInt(scope.minlength, 10);
            }
            // set strings for "Searching..." and "No results"
            scope.textSearching = "Searching..";
            // scope.textNoResults = "No Results Found";
            if (!scope.disableEmptyDropdown) {
                scope.textNoResults = "false";
            } else {
                scope.textNoResults = "No Results Found";
            }

            displaySearching = scope.textSearching === 'false' ? false : true;
            displayNoResults = scope.textNoResults === 'false' ? false : true;
            // set max length (default to maxlength deault from html
            scope.maxlength = attrs.maxlength || 10;
            // register events
            inputField.on('keydown', keydownHandler);
            inputField.on('keyup', keyupHandler);
            // set isScrollOn
            $timeout(function () {
                var css = getComputedStyle(dd);
                isScrollOn = css.maxHeight && css.overflowY === 'auto';
            });
        }
        return {
            restrict: 'EA',
            require: 'ngModel',
            scope: {
                dataObject: '=',
                id: '@',
                type: '@',
                placeholder: '@',
                remoteUrl: '@',
                secondUrl: '@',
                titleField: '@',
                descriptionField: '@',
                pause: '@',
                minlength: '@',
                matchClass: '@',
                inputName: '@',
                afterSelect: '&',
                resetResults: '&',
                clearResultAfterSelect: '@',
                localData: '=',
                viewAllUrl: '@',
                showViewAll: '@',
                disableAfterSelect: '@',
                dropdownSearch: '@',
                searchStr: '=ngModel',
                errorMsg: '=',
                minCodeLengthToDisplay: '@',
                onBlurred: '&',
                disableEmptyDropdown: '=',
                descErrorMsg: '@',
                onHsnChange: '&',
                prodTitleField: '@',
                prodDescriptionField: '@',
                showHsnTabs: '@'
            },
            template: '<div class="autocomplete-holder" data-ng-mouseup="mouseup($event)" data-ng-mousedown="mousedown($event)">' +
                '  <input id="{{id}}_value" name="{{inputName}}" data-ng-model="searchStr" type="text" placeholder="{{placeholder}}"' +
                'data-ng-blur="hideResults($event)"  data-ng-focus="focusHandler()" maxlength="{{maxlength}}" minlength="{{minlength}}" class="form-control" autocapitalize="off" autocorrect="off" style="width: 77%;" autocomplete="off" data-ng-change="inputChangeHandler(searchStr)" data-ng-disabled="disableAfterSelect==\'true\' || (disableAfterSelect==\'true\' && searchStr.length > 0)" data-ng-class="{\'hasclear\':disableAfterSelect}"/><span data-ng-if="disableAfterSelect==\'true\' && searchStr.length > 0" data-ng-click="resetField()" style="margin-right: 22%;" class="clearer fa fa-close"></span>' +
                '<div ng-if="descError"><span data-ng-bind="descErrorMsg" class="err"></span></div>' +
                '  <div id="{{id}}_dropdown" class="autocomplete-dropdown" ng-show="showDropdown" ng-class="{\'dpdwn\' : !showViewAll && results.length>5 }" style="width: 277%;word-break: break-all;position:relative;z-index:1;">' +
                '    <div class="autocomplete-searching" ng-show="searching" ng-bind="textSearching"></div>' +
                '    <div class="autocomplete-searching" ng-show="!searching && (!results || results.length == 0)" ng-bind="textNoResults"></div>' +
                '    <div class="autocomplete-row" ng-repeat="result in results | limitTo: showViewAll ? 5 : results.length" ng-click="selectResult(result)" ' +
                ' ng-mouseenter="hoverRow($index)" title="{{result.title}}" ng-class="{\'autocomplete-selected-row\': $index == currentIndex}">' +
                '      <div ng-if="result.description && result.description != \'\'" class="autocomplete-title" >{{result.description}}-</div>' +
                '      <div class="autocomplete-title" ng-if="dropdownSearch != \'true\' " >{{ result.title }}</div>' +

                '    </div>' +
                '<div class="autocomplete-dropdown-all" ng-show="showDropdown && results.length>5 && showViewAll"><p ng-click="viewAll()"> View All</p></div>' + '<div class="autocomplete-dropdown-all" ng-show="viewMore && showDropdown"><p><a href="" ng-click="showMoreHSN()"><b>SEARCH FROM HSN MASTER</b></a></p></div>' +
                '  </div>' +
                '</div>',
            compile: function (tElement) {
                var startSym = $interpolate.startSymbol(),
                    endSym = $interpolate.endSymbol(),
                    interpolatedHtml;
                if (!(startSym === '{{' && endSym === '}}')) {
                    interpolatedHtml = tElement.html().replace(/\{\{/g, startSym).replace(/\}\}/g, endSym);
                    tElement.html(interpolatedHtml);
                }
                return link;
            }
        };
    }
]);

//Master Product name dropdown
myApp.directive('mstrAutocompleteProdName', ['$q', '$parse', '$http', '$sce', '$timeout', '$templateCache', '$interpolate', '$window', 'shareData', '$location',
    function ($q, $parse, $http, $sce, $timeout, $templateCache, $interpolate, $window, shareData, $location) {
        var KEY_DW = 40,
            KEY_RT = 39,
            KEY_UP = 38,
            KEY_LF = 37,
            KEY_ES = 27,
            KEY_EN = 13,
            MIN_LENGTH = 2,
            BLUR_TIMEOUT = 200;
        function link(scope, elem, attrs, ctrl) {
            var inputField = elem.find('input'),
                minlength = MIN_LENGTH,
                searchTimer = null,
                hideTimer, httpCanceller = null,
                dd = elem[0].querySelector('.autocomplete-dropdown'),
                isScrollOn = false,
                mousedownOn = null,
                displaySearching, displayNoResults, $popup, hideDisplayResutlts = false;
            scope.currentIndex = null;
            scope.searching = false;
            scope.selectedResult = false;
            // scope.errorMsg=null
            if (scope.showViewAll === "true" || scope.showViewAll === true) {
                scope.showViewAll = true;
            } else {
                scope.showViewAll = false;
            }

            // for IE8 quirkiness about event.which
            function ie8EventNormalizer(event) {
                return event.which || event.keyCode;
            }

            function extractValue(obj, key) {
                var keys, result, i;
                if (key) {
                    keys = key.split('.');
                    result = obj;
                    for (i = 0; i < keys.length; i = i + 1) {
                        result = result[keys[i]];
                    }
                } else {
                    result = obj;
                }
                return result;
            }

            function extractTitle(data) {
                return scope.titleField.split(',').map(function (field) {
                    return extractValue(data, field);
                }).join(' ');
            }
            function extractProdTitle(data) {
                return scope.prodTitleField.split(',').map(function (field) {
                    return extractValue(data, field);
                }).join(' ');
            }

            function findMatchString(target, str) {
                var result, matches, re;
                re = new RegExp(str.replace(/[.*+?\^${}()|\[\]\\]/g, '\\$&'), 'i');
                if (!target) {
                    return;
                }
                if (!target.match || !target.replace) {
                    target = target.toString();
                }
                matches = target.match(re);
                if (matches) {
                    result = target.replace(re, '<span class="' + scope.matchClass + '">' + matches[0] + '</span>');
                } else {
                    result = target;
                }
                return $sce.trustAsHtml(result);
            }

            function initResults() {
                scope.showDropdown = displaySearching;
                scope.errorMsg = null;
                scope.currentIndex = -1;
                scope.results = [];
                scope.resultList = null;
            }

            function clearResults() {
                scope.showDropdown = false;
                scope.resultList = null;
                scope.results = [];
                if (dd) {
                    dd.scrollTop = 0;
                }
            }

            function filterResultByCodeLength(responseData, minCodeLength) {
                var regexPattern1Digit = /^[0-9]{1}$/;
                // filter only if minCodeLength is a digit between 0-9
                if (regexPattern1Digit.test(minCodeLength)) {
                    var minCodeLength = parseInt(minCodeLength, 10);
                    responseData = responseData.filter(function (element) {
                        return element.c.length >= minCodeLength;
                    });
                }
                return responseData;
            }

            function processprodResults(responseData, str) {
                var i, description, text, formattedText, formattedDesc;
                if (responseData && responseData.length > 0) {
                    scope.results = [];
                    for (i = 0; i < responseData.length; i = i + 1) {
                        if (scope.prodTitleField && scope.prodTitleField !== '') {
                            description = formattedDesc = extractProdTitle(responseData[i]);
                        }
                        description = '';
                        if (scope.prodDescriptionField) {
                            text = formattedText = extractValue(responseData[i], scope.prodDescriptionField);
                        }
                        if (scope.matchClass) {
                            formattedText = findMatchString(text, str);
                            formattedDesc = findMatchString(description, str);
                        }
                        scope.results[scope.results.length] = {
                            title: formattedText,
                            description: formattedDesc,
                            originalObject: responseData[i]
                        };
                    }
                    scope.results.sort(function(a,b){
                        return parseInt(a.description)-parseInt(b.description);
                    })
                } else {
                    scope.results = [];
                    scope.errorMsg = scope.textNoResults
                }
                if (scope.results.length === 0 && !displayNoResults) {
                    scope.showDropdown = false;
                } else if (hideDisplayResutlts) {
                    scope.showDropdown = false;
                }
                else {
                    scope.showDropdown = true;
                }
            }


            function processResults(responseData, str) {
                var i, description, text, formattedText, formattedDesc;
                scope.resultList = responseData;
                responseData = filterResultByCodeLength(responseData, scope.minCodeLengthToDisplay);
                if (responseData && responseData.length > 0) {
                    scope.results = [];
                    for (i = 0; i < responseData.length; i = i + 1) {
                        if (scope.titleField && scope.titleField !== '') {
                            text = formattedText = extractTitle(responseData[i]);
                        }
                        description = '';
                        if (scope.descriptionField) {
                            description = formattedDesc = extractValue(responseData[i], scope.descriptionField);
                        }
                        if (scope.matchClass) {
                            formattedText = findMatchString(text, str);
                            formattedDesc = findMatchString(description, str);
                        }
                        scope.results[scope.results.length] = {
                            title: formattedText,
                            description: formattedDesc,
                            originalObject: responseData[i]
                        };
                    }
                } else {
                    scope.results = [];
                    scope.errorMsg = scope.textNoResults
                }
                if (scope.results.length === 0 && !displayNoResults) {
                    scope.showDropdown = false;
                } else if (hideDisplayResutlts) {
                    scope.showDropdown = false;
                }
                else {
                    scope.showDropdown = true;
                }
            }

            function cancelHttpRequest() {
                if (httpCanceller) {
                    httpCanceller.resolve();
                    scope.showDropdown = false
                }
            }



            function getLocProdResults(str) {
                var i, match, s, value, matches, searchFields = [];
                searchFields.push(scope.prodTitleField);
                searchFields.push(scope.prodDescriptionField);
                matches = [];
                if (scope.prodData) {
                    for (i = 0; i < scope.prodData.length; i = i + 1) {
                        match = false;
                        for (s = 0; s < searchFields.length; s = s + 1) {
                            value = extractValue(scope.prodData[i], searchFields[s]) || '';
                            match = match || (value.toString().toLowerCase().indexOf(str.toString().toLowerCase()) >= 0);
                        }

                        if (match) {
                            matches[matches.length] = scope.prodData[i];
                        }
                    }
                }
                return matches;
            }

            function searchTimerComplete(str) {
                if ((!str || str.length < minlength) && scope.dropdownSearch !== 'true') {
                    return;
                }
                var found = false;
                scope.viewMore = false;
                if (sessionStorage.getItem('supRecipGstin')) {
                    scope.prodData = JSON.parse(sessionStorage.getItem('supRecipGstin')).productsMasters;
                    //Logic - if we found hsn code then var found = true; else found = false;
                }
                setTimeout(function () {
                    scope.$apply(function () {
                        var matches = getLocProdResults(str); 
                        if (matches && matches.length > 0) {
                            found = true;
                            scope.searching = false;
                            clearResults();
                            processprodResults(matches, str);
                        } else {
                            found = false;
                            scope.rmlengthvalidation = false;
                            minlength = 2;
                        }
                    });
                });


            }
            scope.focusHandler = function () {
                if (!scope.showDropdown && scope.dropdownSearch === 'true') {
                    initResults();
                    scope.searchStr = "";
                    scope.searching = true;
                    searchTimerComplete(scope.searchStr);
                }
                hideDisplayResutlts = false;
            };

            function keyupHandler(event) {
                var which = ie8EventNormalizer(event);
                if (which === KEY_LF || which === KEY_RT) {
                    return;
                }
                if (which === KEY_UP || which === KEY_EN) {
                    event.preventDefault();
                } else if (which === KEY_DW) {
                    event.preventDefault();
                    if (!scope.showDropdown && scope.searchStr && scope.searchStr.length >= minlength) {
                        initResults();
                        scope.searching = true;
                        searchTimerComplete(scope.searchStr);
                    }
                } else if (which === KEY_ES) {
                    clearResults();
                    scope.$apply(function () {
                        inputField.val(scope.searchStr);
                    });
                }
                else {
                    var pattern = new RegExp("^\\d{2,8}$");
                    if (minlength === 0 && !scope.searchStr) {
                        return;
                    }
                    if ((!scope.searchStr || scope.searchStr === '') && scope.dropdownSearch !== 'true') {
                        scope.showDropdown = false;
                    } else if (scope.searchStr.length >= minlength && pattern.test(scope.searchStr)) {
                        initResults();
                        if (searchTimer) {
                            $timeout.cancel(searchTimer);
                        }
                        scope.searching = true;
                        searchTimer = $timeout(function () {
                            searchTimerComplete(scope.searchStr);
                        }, scope.pause);
                    }
                    else if (!pattern.test(scope.searchStr) && (scope.searchStr.length >= Math.max(4, parseInt(minlength)) || scope.rmlengthvalidation)) {
                        initResults();
                        if (searchTimer) {
                            $timeout.cancel(searchTimer);
                        }
                        scope.searching = true;
                        searchTimer = $timeout(function () {
                            searchTimerComplete(scope.searchStr);
                        }, scope.pause);
                    }
                }
            }

            function dropdownRowOffsetHeight(row) {
                var css = getComputedStyle(row);
                return row.offsetHeight + parseInt(css.marginTop, 10) + parseInt(css.marginBottom, 10);
            }

            function dropdownHeight() {
                return dd.getBoundingClientRect().top + parseInt(getComputedStyle(dd).maxHeight, 10);
            }

            function dropdownRow() {
                return elem[0].querySelectorAll('.autocomplete-row')[scope.currentIndex];
            }

            function dropdownRowTop() {
                return dropdownRow().getBoundingClientRect().top -
                    (dd.getBoundingClientRect().top +
                        parseInt(getComputedStyle(dd).paddingTop, 10));
            }

            function dropdownScrollTopTo(offset) {
                dd.scrollTop = dd.scrollTop + offset;
            }

            function updateInputField() {
                var current = scope.results[scope.currentIndex];
                if (scope.matchClass) {
                    inputField.val(extractTitle(current.originalObject));
                } else {
                    inputField.val(current.description);
                }
            }

            function keydownHandler(event) {
                var which = ie8EventNormalizer(event),
                    row = null,
                    rowTop = null;
                if (which === KEY_EN && scope.results) {
                    if (scope.currentIndex >= 0 && scope.currentIndex < scope.results.length) {
                        event.preventDefault();
                        scope.selectResult(scope.results[scope.currentIndex]);
                    }
                    scope.$apply();
                } else if (which === KEY_DW && scope.results) {
                    event.preventDefault();
                    if ((scope.currentIndex + 1) < scope.results.length && scope.showDropdown) {
                        scope.$apply(function () {
                            scope.currentIndex = scope.currentIndex + 1;
                            updateInputField();
                        });
                        if (isScrollOn) {
                            row = dropdownRow();
                            if (dropdownHeight() < row.getBoundingClientRect().bottom) {
                                dropdownScrollTopTo(dropdownRowOffsetHeight(row));
                            }
                        }
                    }
                } else if (which === KEY_UP && scope.results) {
                    event.preventDefault();
                    if (scope.currentIndex >= 1) {
                        scope.$apply(function () {
                            scope.currentIndex = scope.currentIndex - 1;
                            updateInputField();
                        });
                        if (isScrollOn) {
                            rowTop = dropdownRowTop();
                            if (rowTop < 0) {
                                dropdownScrollTopTo(rowTop - 1);
                            }
                        }
                    } else if (scope.currentIndex === 0) {
                        scope.$apply(function () {
                            scope.currentIndex = -1;
                            inputField.val(scope.searchStr);
                        });
                    }
                } else if (which === KEY_ES) {
                    // This is very specific to IE10/11 #272
                    // without this, IE clears the input text
                    event.preventDefault();
                }
            }

            function showAll() {
                if (scope.localData) {
                    scope.searching = false;
                    processResults(scope.localData, '');
                } else {
                    scope.searching = true;
                    getRemoteResults('');
                }
            }
            scope.mouseup = function (e) {
                scope.scroll = false;
            };
            scope.mousedown = function (e) {
                scope.scroll = true;
            };
            scope.hideResults = function (e) {
                scope.descError = null;
                if ((mousedownOn && (mousedownOn === scope.id + '_dropdown' || mousedownOn.indexOf('autocomplete') >= 0)) || scope.scroll) {
                    mousedownOn = null;
                } else {
                    hideTimer = $timeout(function () {
                        scope.showDropdown = false;
                        scope.errorMsg = null;
                        scope.$apply(function () {
                            if (scope.searchStr && scope.searchStr.length > 0) {
                                //
                                function altFind(arr, callback) {
                                    for (var i = 0; i < arr.length; i++) {
                                        var match = callback(arr[i]);
                                        if (match) {
                                            return arr[i];
                                        }
                                    }
                                }
                                const result = altFind(scope.results, function (e) { return e.description === scope.searchStr })
                                // const result = scope.results.find( ({ description }) => description === scope.searchStr  );
                                if (!result || result.length < 1) { scope.errorMsg = scope.textNoResults }
                                inputField.val(scope.searchStr);
                            }
                        });
                        scope.afterBlur();
                    }, BLUR_TIMEOUT);
                    cancelHttpRequest();
                }
            };

            scope.afterBlur = function () {
                hideDisplayResutlts = true;
                scope.onBlurred({ 'resultList': scope.resultList });

            }

            scope.hoverRow = function (index) {
                scope.currentIndex = index;
            };
            scope.viewAll = function () {
                shareData.sacResults = scope.results;
                shareData.searchStr = scope.searchStr;
                shareData.dataObject = scope.dataObject;
                $location.path(scope.viewAllUrl);
            };
            scope.selectResult = function (result) {
                if (scope.matchClass) {
                    result.title = extractTitle(result.originalObject);
                    result.description = extractValue(result.originalObject, scope.descriptionField);
                }
                if (scope.clearResultAfterSelect === 'true' || scope.clearResultAfterSelect === true) {
                    scope.searchStr = "";
                } else {
                    scope.searchStr = result.description;
                }
                //callOrAssign(result.originalObject);
                clearResults();
                scope.selectedResult = true;
                scope.afterSelect({
                    'result': result.originalObject
                });
            };
            scope.resetField = function () {
                scope.selectedResult = false;
                scope.searchStr = "";
                scope.showDropdown = false;
                scope.resetResults();
                scope.prodDescriptionField = "productName";
            };
            scope.rmlengthvalidation = false;
            scope.inputChangeHandler = function (str) {
                scope.showDropdown = false;
                scope.errorMsg = false;
                scope.descError = null;
                scope.onHsnChange();
                if (sessionStorage.getItem('supRecipGstin')) {
                    scope.rmlengthvalidation = true;
                    minlength = 1;
                }
                var pattern = new RegExp("^\\d{2,8}$");
                if (str && str.length < minlength) {
                    scope.errorMsg = "Enter 2 digits/4 characters or more to search";
                    scope.descError = "Enter 2 digits/4 characters or more to search";
                    cancelHttpRequest();
                    clearResults();
                }
                else if (str && !pattern.test(str) && str.length < Math.max(4, minlength) && !scope.rmlengthvalidation) {
                    scope.descError = "Enter 2 digits/4 characters or more to search";
                    cancelHttpRequest();
                    clearResults();
                }
                else if (str && str.length === 0 && minlength === 0) {
                    scope.searching = false;
                    showAll();
                }
                return str;
            };
            // check min length
            if (scope.minlength && scope.minlength !== '') {
                minlength = parseInt(scope.minlength, 10);
            }
            // set strings for "Searching..." and "No results"
            scope.textSearching = "Searching..";
            // scope.textNoResults = "No Results Found";
            if (!scope.disableEmptyDropdown) {
                scope.textNoResults = "false";
            } else {
                scope.textNoResults = "No Results Found";
            }

            displaySearching = scope.textSearching === 'false' ? false : true;
            displayNoResults = scope.textNoResults === 'false' ? false : true;
            // set max length (default to maxlength deault from html
            scope.maxlength = attrs.maxlength || 10;
            // register events
            inputField.on('keydown', keydownHandler);
            inputField.on('keyup', keyupHandler);
            // set isScrollOn
            $timeout(function () {
                var css = getComputedStyle(dd);
                isScrollOn = css.maxHeight && css.overflowY === 'auto';
            });
        }
        return {
            restrict: 'EA',
            require: 'ngModel',
            scope: {
                dataObject: '=',
                id: '@',
                type: '@',
                placeholder: '@',
                remoteUrl: '@',
                secondUrl: '@',
                titleField: '@',
                descriptionField: '@',
                pause: '@',
                minlength: '@',
                matchClass: '@',
                inputName: '@',
                afterSelect: '&',
                resetResults: '&',
                clearResultAfterSelect: '@',
                localData: '=',
                viewAllUrl: '@',
                showViewAll: '@',
                disableAfterSelect: '@',
                dropdownSearch: '@',
                searchStr: '=ngModel',
                errorMsg: '=',
                minCodeLengthToDisplay: '@',
                onBlurred: '&',
                disableEmptyDropdown: '=',
                descErrorMsg: '@',
                onHsnChange: '&',
                prodTitleField: '@',
                prodDescriptionField: '@',
            },
            template: '<div class="autocomplete-holder" data-ng-mouseup="mouseup($event)" data-ng-mousedown="mousedown($event)">' +
                '  <input id="{{id}}_value" name="{{inputName}}" data-ng-model="searchStr" type="text" placeholder="{{placeholder}}"' +
                'data-ng-blur="hideResults($event)"  data-ng-focus="focusHandler()" maxlength="{{maxlength}}" minlength="{{minlength}}" class="form-control formedit" autocapitalize="off" autocorrect="off" style="width: 77%;" autocomplete="off" data-ng-change="inputChangeHandler(searchStr)" data-ng-disabled="disableAfterSelect==\'true\' || (disableAfterSelect==\'true\' && searchStr.length > 0)" data-ng-class="{\'hasclear\':disableAfterSelect}"/><span data-ng-if="disableAfterSelect==\'true\' && searchStr.length > 0" data-ng-click="resetField()" style="margin-right: 22%;" class="clearer fa fa-close"></span>' +
                '<div ng-if="descError"><span data-ng-bind="descError" class="err"></span></div>' +
                '  <div id="{{id}}_dropdown" class="autocomplete-dropdown" ng-show="showDropdown" ng-class="{\'dpdwn\' : !showViewAll && results.length>5 }" style="width: 277%;word-break: break-all;position:relative;z-index:1;">' +
                '    <div class="autocomplete-searching" ng-show="searching" ng-bind="textSearching"></div>' +
                '    <div class="autocomplete-searching" ng-show="!searching && (!results || results.length == 0)" ng-bind="textNoResults"></div>' +
                '    <div class="autocomplete-row" ng-repeat="result in results | limitTo: showViewAll ? 5 : results.length" ng-click="selectResult(result)" ' +
                ' ng-mouseenter="hoverRow($index)" title="{{result.title}}" ng-class="{\'autocomplete-selected-row\': $index == currentIndex}">' +
                '      <div ng-if="result.description && result.description != \'\'" class="autocomplete-title" >{{result.description}}-</div>' +
                '      <div class="autocomplete-title" ng-if="dropdownSearch != \'true\' " >{{ result.title }}</div>' +

                '    </div>' +
                '<div class="autocomplete-dropdown-all" ng-show="showDropdown && results.length>5 && showViewAll"><p ng-click="viewAll()"> View All</p></div>' + '<div class="autocomplete-dropdown-all" ng-show="viewMore && showDropdown"><p><a href="" ng-click="showMoreHSN()"><b>SEARCH FROM HSN MASTER</b></a></p></div>' +
                '  </div>' +
                '</div>',
            compile: function (tElement) {
                var startSym = $interpolate.startSymbol(),
                    endSym = $interpolate.endSymbol(),
                    interpolatedHtml;
                if (!(startSym === '{{' && endSym === '}}')) {
                    interpolatedHtml = tElement.html().replace(/\{\{/g, startSym).replace(/\}\}/g, endSym);
                    tElement.html(interpolatedHtml);
                }
                return link;
            }
        };
    }
]);


//Master hsn 

myApp.directive('mstrAutocompleteHsn', ['$q', '$parse', '$http', '$sce', '$timeout', '$templateCache', '$interpolate', '$window', 'shareData', '$location',
    function ($q, $parse, $http, $sce, $timeout, $templateCache, $interpolate, $window, shareData, $location) {
        var KEY_DW = 40,
            KEY_RT = 39,
            KEY_UP = 38,
            KEY_LF = 37,
            KEY_ES = 27,
            KEY_EN = 13,
            MIN_LENGTH = 4,
            MIN_SIX_LENTH = 6,
            MIN_EGT_LENTH = 8,
            BLUR_TIMEOUT = 200;
        function link(scope, elem, attrs, ctrl) {
            var inputField = elem.find('input'),
                minlength = MIN_LENGTH,
                minsixlength = MIN_SIX_LENTH,
                mineghtlenth = MIN_EGT_LENTH,
                searchTimer = null,
                hideTimer, httpCanceller = null,
                dd = elem[0].querySelector('.autocomplete-dropdown'),
                isScrollOn = false,
                mousedownOn = null,
                displaySearching, displayNoResults, $popup;
            scope.currentIndex = null;
            scope.searching = false;
            scope.selectedResult = false;
            if (scope.showViewAll === "true" || scope.showViewAll === true) {
                scope.showViewAll = true;
            } else {
                scope.showViewAll = false;
            }

            function clickoutHandlerForDropdown(event) {
                mousedownOn = null;
                scope.hideResults(event);
                document.body.removeEventListener('click', clickoutHandlerForDropdown);
            }

            // for IE8 quirkiness about event.which
            function ie8EventNormalizer(event) {
                return event.which || event.keyCode;
            }

            function extractValue(obj, key) {
                var keys, result, i;
                if (key) {
                    keys = key.split('.');
                    result = obj;
                    for (i = 0; i < keys.length; i = i + 1) {
                        result = result[keys[i]];
                    }
                } else {
                    result = obj;
                }
                return result;
            }

            function extractTitle(data) {
                return scope.titleField.split(',').map(function (field) {
                    return extractValue(data, field);
                }).join(' ');
            }

            function findMatchString(target, str) {
                var result, matches, re;
                re = new RegExp(str.replace(/[.*+?\^${}()|\[\]\\]/g, '\\$&'), 'i');
                if (!target) {
                    return;
                }
                if (!target.match || !target.replace) {
                    target = target.toString();
                }
                matches = target.match(re);
                if (matches) {
                    result = target.replace(re, '<span class="' + scope.matchClass + '">' + matches[0] + '</span>');
                } else {
                    result = target;
                }
                return $sce.trustAsHtml(result);
            }

            function initResults() {
                scope.showDropdown = displaySearching;
                scope.errorMsg = null;
                scope.currentIndex = -1;
                scope.results = [];
            }

            function clearResults() {
                scope.showDropdown = false;
                 scope.results = [];
                if (dd) {
                    dd.scrollTop = 0;
                }
             
            }

            function filterResultByCodeLength(responseData, minCodeLength) {
                var regexPattern1Digit = /^[0-9]{1}$/;
                // filter only if minCodeLength is a digit between 0-9
                if (regexPattern1Digit.test(minCodeLength)) {
                    var minCodeLength = parseInt(minCodeLength, 10);
                    responseData = responseData.filter(function (element) {
                        return element.c.length >= minCodeLength;
                    });
                }
                return responseData;
            }

            function processResults(responseData, str) {
                var i, description, text, formattedText, formattedDesc;
                responseData = filterResultByCodeLength(responseData, scope.minCodeLengthToDisplay);
                if (responseData && responseData.length > 0) {
                    scope.results = [];
                    for (i = 0; i < responseData.length; i = i + 1) {
                        if (scope.titleField && scope.titleField !== '') {
                            text = formattedText = extractTitle(responseData[i]);
                        }
                        description = '';
                        if (scope.descriptionField) {
                            description = formattedDesc = extractValue(responseData[i], scope.descriptionField);
                        }
                        if (scope.matchClass) {
                            formattedText = findMatchString(text, str);
                            formattedDesc = findMatchString(description, str);
                        }
                        scope.results[scope.results.length] = {
                            title: formattedText,
                            description: formattedDesc,
                            originalObject: responseData[i]
                        };
                    }
                } else {
                    scope.results = [];
                    scope.errorMsg = scope.textNoResults
                }
                if (scope.results.length === 0 && !displayNoResults) {
                    scope.showDropdown = false;
                    
                } else {
                    scope.showDropdown = true;
                }
            }

            function cancelHttpRequest() {
                if (httpCanceller) {
                    httpCanceller.resolve();
                }
            }

            function getLocalResults(str) {
                var i, match, s, value, matches, searchFields = [];
                searchFields.push(scope.titleField);
                searchFields.push(scope.descriptionField);
                matches = [];
                for (i = 0; i < scope.localData.length; i = i + 1) {
                    match = false;
                    for (s = 0; s < searchFields.length; s = s + 1) {
                        value = extractValue(scope.localData[i], searchFields[s]) || '';
                        match = match || (value.toString().toLowerCase().indexOf(str.toString().toLowerCase()) >= 0);
                    }

                    if (match) {
                        matches[matches.length] = scope.localData[i];
                    }
                }
                return matches;
            }

            function getRemoteResults(str) {
                if (str === "" || str === undefined || str.length<minlength) {
                    scope.searching = false;
                    return;
                }
                var params = {
                    params: {
                        "q": str
                    }
                },
                    url = scope.remoteUrl;
                if (angular.isDefined(scope.secondUrl) && str.substr(0, 2) == "99") {
                    url = scope.secondUrl;
                }
                cancelHttpRequest();
                httpCanceller = $q.defer();
                params.timeout = httpCanceller.promise;
                $http.get(url + str)
                    .success(function (responseData) {
                        scope.searching = false;
                        processResults(extractValue(responseData, "data"), str);
                    }).error(function (err) {
                        scope.searching = false;
                    });
            }

            function searchTimerComplete(str) {
                if ((!str || str.length < minlength) && scope.dropdownSearch !== 'true') {
                    return;
                }
                if (scope.localData) {
                    setTimeout(function () {
                        scope.$apply(function () {
                            var matches = getLocalResults(str);
                            scope.searching = false;
                            processResults(matches, str);
                        });
                    });
                } else {
                    getRemoteResults(str);
                }
            }
            scope.focusHandler = function () {
                if (!scope.showDropdown && scope.dropdownSearch === 'true') {
                    initResults();
                    scope.searchStr = "";
                    scope.searching = true;
                    searchTimerComplete(scope.searchStr);
                }
            };

            function keyupHandler(event) {
                var which = ie8EventNormalizer(event);
                if (which === KEY_LF || which === KEY_RT) {
                    return;
                }
                if (which === KEY_UP || which === KEY_EN) {
                    event.preventDefault();
                } else if (which === KEY_DW) {
                    event.preventDefault();
                    var pattern = new RegExp("^\\d{2,}$");
                    if (!scope.showDropdown && scope.searchStr && scope.searchStr.length >= minlength && pattern.test(scope.searchStr) && (scope.searchStr.length == 4 || scope.searchStr.length == 6 || scope.searchStr.length == 8)) {
                        scope.searching = true;
                        initResults();
                       searchTimerComplete(scope.searchStr);
                    }else if(!scope.showDropdown && scope.searchStr && scope.searchStr.length >= 3 && !pattern.test(scope.searchStr)){
                        scope.searching = true;
                        initResults();
                        searchTimerComplete(scope.searchStr);
                    }
                    else if (searchStr ==""){
                        scope.searching = false;
                        scope.showDropdown = false;
                        scope.$apply();
                    }else{
                        scope.searching = false;
                        scope.$apply();
                    }

                } else if (which === KEY_ES) {
                    clearResults();
                    scope.$apply(function () {
                        inputField.val(scope.searchStr);
                    });
                } else {
                    if (minlength === 0 && !scope.searchStr) {
                        return;
                    }
                    if ((!scope.searchStr || scope.searchStr === '') && scope.dropdownSearch !== 'true') {
                        scope.showDropdown = false;
                        scope.$apply();
                    } else if (scope.searchStr.length >= minlength) {
                        var pattern = new RegExp("^\\d{2,}$");
                        if (pattern.test(scope.searchStr) && (scope.searchStr.length == 4 || scope.searchStr.length == 6 || scope.searchStr.length == 8)) {
                            scope.errMsg = null;
                            scope.searching = true;
                            initResults();
                            if (searchTimer) {
                                $timeout.cancel(searchTimer);
                            }
                           
                            searchTimer = $timeout(function () {
                                searchTimerComplete(scope.searchStr);
                            }, scope.pause);
                        }
                        else if(!pattern.test(scope.searchStr) && scope.searchStr.length >= 3){
                            scope.errMsg = null;
                            scope.searching = true;
                            initResults();
                            if (searchTimer) {
                                $timeout.cancel(searchTimer);
                            }
                           
                            searchTimer = $timeout(function () {
                                searchTimerComplete(scope.searchStr);
                            }, scope.pause);
                        }
                       
                     
                    }
                }
            }

            function dropdownRowOffsetHeight(row) {
                var css = getComputedStyle(row);
                return row.offsetHeight + parseInt(css.marginTop, 10) + parseInt(css.marginBottom, 10);
            }

            function dropdownHeight() {
                return dd.getBoundingClientRect().top + parseInt(getComputedStyle(dd).maxHeight, 10);
            }

            function dropdownRow() {
                return elem[0].querySelectorAll('.autocomplete-row')[scope.currentIndex];
            }

            function dropdownRowTop() {
                return dropdownRow().getBoundingClientRect().top -
                    (dd.getBoundingClientRect().top +
                        parseInt(getComputedStyle(dd).paddingTop, 10));
            }

            function dropdownScrollTopTo(offset) {
                dd.scrollTop = dd.scrollTop + offset;
            }

            function updateInputField() {
                var current = scope.results[scope.currentIndex];
                if (scope.matchClass) {
                    inputField.val(extractTitle(current.originalObject));
                } else {
                    inputField.val(current.description);
                }
            }

            function keydownHandler(event) {
                var which = ie8EventNormalizer(event),
                    row = null,
                    rowTop = null;
                if (which === KEY_EN && scope.results) {
                    if (scope.currentIndex >= 0 && scope.currentIndex < scope.results.length) {
                        event.preventDefault();
                        scope.selectResult(scope.results[scope.currentIndex]);
                    } else {
                        event.preventDefault();
                        $timeout.cancel(searchTimer);
                        getRemoteResults(scope.searchStr);
                    }
                    scope.$apply();
                } else if (which === KEY_DW && scope.results) {
                    event.preventDefault();
                    if ((scope.currentIndex + 1) < scope.results.length && scope.showDropdown) {
                        scope.$apply(function () {
                            scope.currentIndex = scope.currentIndex + 1;
                            updateInputField();
                        });
                        if (isScrollOn) {
                            row = dropdownRow();
                            if (dropdownHeight() < row.getBoundingClientRect().bottom) {
                                dropdownScrollTopTo(dropdownRowOffsetHeight(row));
                            }
                        }
                    }
                } else if (which === KEY_UP && scope.results) {
                    event.preventDefault();
                    if (scope.currentIndex >= 1) {
                        scope.$apply(function () {
                            scope.currentIndex = scope.currentIndex - 1;
                            updateInputField();
                        });
                        if (isScrollOn) {
                            rowTop = dropdownRowTop();
                            if (rowTop < 0) {
                                dropdownScrollTopTo(rowTop - 1);
                            }
                        }
                    } else if (scope.currentIndex === 0) {
                        scope.$apply(function () {
                            scope.currentIndex = -1;
                            inputField.val(scope.searchStr);
                        });
                    }
                } else if (which === KEY_ES) {
                    // This is very specific to IE10/11 #272
                    // without this, IE clears the input text
                    event.preventDefault();
                }
            }

            function showAll() {
                if (scope.localData) {
                    scope.searching = false;
                    processResults(scope.localData, '');
                } else {
                    scope.searching = true;
                    getRemoteResults('');
                }
            }
            scope.mouseup = function (e) {
                scope.scroll = false;
            };
            scope.mousedown = function (e) {
                scope.scroll = true;
            };
            scope.hideResults = function (e) {
                if ((mousedownOn && (mousedownOn === scope.id + '_dropdown' || mousedownOn.indexOf('autocomplete') >= 0)) || scope.scroll) {
                    mousedownOn = null;
                } else {
                    hideTimer = $timeout(function () {
                        scope.showDropdown = false;
                        scope.errorMsg = null;
                        scope.$apply(function () {
                            if (scope.searchStr && scope.searchStr.length > 0) {
                                //
                                function altFind(arr, callback) {
                                    for (var i = 0; i < arr.length; i++) {
                                        var match = callback(arr[i]);
                                        if (match) {
                                            return arr[i];
                                        }
                                    }
                                }
                                const result = altFind(scope.results, function (e) { return e.description === scope.searchStr })
                                if (!result || result.length < 1) { scope.errorMsg = scope.textNoResults }
                                inputField.val(scope.searchStr);
                            }
                        });
                    }, BLUR_TIMEOUT);
                    cancelHttpRequest();
                }
                scope.afterBlur();
            };
            scope.hoverRow = function (index) {
                scope.currentIndex = index;
            };
            scope.viewAll = function () {
                shareData.sacResults = scope.results;
                shareData.searchStr = scope.searchStr;
                shareData.dataObject = scope.dataObject;
                $location.path(scope.viewAllUrl);
            };
            scope.selectResult = function (result) {
                if (scope.matchClass) {
                    result.title = extractTitle(result.originalObject);
                    result.description = extractValue(result.originalObject, scope.descriptionField);
                }
                if (scope.clearResultAfterSelect === 'true' || scope.clearResultAfterSelect === true) {
                    scope.searchStr = "";
                } else {
                    scope.searchStr = result.description;
                }
          
                clearResults();
                scope.selectedResult = true;
                scope.afterSelect({
                    'result': result.originalObject
                });
                scope.errMsg = null;
            };
            scope.resetField = function () {
                scope.selectedResult = false;
                scope.searchStr = "";
                scope.showDropdown = false;
                scope.resetResults();
            };
            scope.inputChangeHandler = function (str) {
              
                var pattern = new RegExp("^\\d{2,}$");
                if (str && str.length < minlength) {
                    scope.errorMsg = "HSN code should be of 4,6 or 8 digits only";
                    cancelHttpRequest();
                    clearResults();
                    scope.errMsg = null;
                    scope.showDropdown = false;
                   
                } else if (str && str.length === 0 && minlength === 0) {
                    scope.searching = false;
                    showAll();
                    scope.errMsg = null;
                } else if (str && pattern.test(str) && (str.length != 4 || str.length != 6 || str.length != 8)) {
                    clearResults();
                    scope.searching = false;
                    showAll();
                    scope.showDropdown = true;
                    scope.errMsg = "HSN code should be of 4,6 or 8 digits only";
                    displayNoResults = true;
                    scope.errorMsg = scope.errMsg;
                }
                else if (str == ""){
                    cancelHttpRequest();
                    clearResults();
                    scope.errMsg = null;
                    scope.showDropdown = false;
                  
                }

                return str;
            };
           
            // check min length
            if (scope.minlength && scope.minlength !== '') {
                minlength = parseInt(scope.minlength, 10);
            }
            // set strings for "Searching..." and "No results"
            scope.textSearching = "Searching..";
            scope.textNoResults = "No Results Found";
            displaySearching = scope.textSearching === 'false' ? false : true;
            displayNoResults = scope.textNoResults === 'false' ? false : true;
            // set max length (default to maxlength deault from html
            scope.maxlength = attrs.maxlength || 10;
            // register events
            inputField.on('keydown', keydownHandler);
            inputField.on('keyup', keyupHandler);
            // set isScrollOn
            $timeout(function () {
                var css = getComputedStyle(dd);
                isScrollOn = css.maxHeight && css.overflowY === 'auto';
            });
        }
        return {
            restrict: 'EA',
            require: 'ngModel',
            scope: {
                dataObject: '=',
                id: '@',
                type: '@',
                placeholder: '@',
                remoteUrl: '@',
                secondUrl: '@',
                titleField: '@',
                descriptionField: '@',
                pause: '@',
                minlength: '@',
                matchClass: '@',
                inputName: '@',
                afterSelect: '&',
                resetResults: '&',
                clearResultAfterSelect: '@',
                localData: '=',
                viewAllUrl: '@',
                showViewAll: '@',
                disableAfterSelect: '@',
                dropdownSearch: '@',
                searchStr: '=ngModel',
                errorMsg: '=',
                minCodeLengthToDisplay: '@',
                afterBlur: '&'
            },
            template: '<div class="autocomplete-holder" data-ng-mouseup="mouseup($event)" data-ng-mousedown="mousedown($event)">' +
                '  <input id="{{id}}_value" name="{{inputName}}" data-ng-model="searchStr" type="text" placeholder="{{placeholder}}"' +
                'data-ng-blur="hideResults($event)" required  data-ng-focus="focusHandler()" maxlength="{{maxlength}}" minlength="{{minlength}}" class="form-control" autocapitalize="off" autocorrect="off" autocomplete="off" data-ng-change="inputChangeHandler(searchStr)" data-ng-disabled="disableAfterSelect==\'true\'" data-ng-class="{\'hasclear\':disableAfterSelect}"/><span data-ng-if="disableAfterSelect==\'true\' && searchStr.length > 0" data-ng-click="resetField()" class="clearer fa fa-close"></span>' +

                '  <div id="{{id}}_dropdown" class="autocomplete-dropdown" ng-show="showDropdown" ng-class="{\'dpdwn\' : !showViewAll && results.length>5 }" style="width: 100%">' +
                '    <div class="autocomplete-searching" ng-show="searching" ng-bind="textSearching"></div>' +
                '    <div class="autocomplete-searching" ng-show="!searching && (!results || results.length == 0) " ng-bind="errorMsg"></div>' +
               
                '    <div class="autocomplete-row" ng-repeat="result in results | limitTo: showViewAll ? 5 : results.length" ng-click="selectResult(result)" ' +
                ' ng-mouseenter="hoverRow($index)" title="{{result.title}}" ng-class="{\'autocomplete-selected-row\': $index == currentIndex}">' +
                '      <div ng-if="result.description && result.description != \'\'" class="autocomplete-title" >{{result.description}}-</div>' +
                '      <div class="autocomplete-title" ng-if="dropdownSearch != \'true\' " >{{ result.title }}</div>' +

                '    </div>' +
                '<div class="autocomplete-dropdown-all" ng-show="showDropdown && results.length>5 && showViewAll"><p ng-click="viewAll()"> View All</p></div>' +
                '  </div>' +
                '</div>',
            compile: function (tElement) {
                var startSym = $interpolate.startSymbol(),
                    endSym = $interpolate.endSymbol(),
                    interpolatedHtml;
                if (!(startSym === '{{' && endSym === '}}')) {
                    interpolatedHtml = tElement.html().replace(/\{\{/g, startSym).replace(/\}\}/g, endSym);
                    tElement.html(interpolatedHtml);
                }
                return link;
            }
        };
    }
]);

myApp.directive('formatting', ['$filter', '$locale', function ($filter, $locale) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) {
                return;
            }

            ctrl.$formatters.unshift(function (a) {
                $locale.NUMBER_FORMATS.PATTERNS[1].gSize = 2;
                if (attrs.formatting && attrs.formatting.length > 0) {
                    if (attrs.name !== 'qty')
                        return $filter(attrs.formatting)(ctrl.$modelValue, '', attrs.fraction); // removed ₹ symbol as param for ICR 17052
                }
                return ctrl.$modelValue;
            });
            ctrl.$parsers.push(function (input) {
                var myval = input;
                var patt15 = /^(\-?(\d{0,13})(\.\d{0,2})?)$/
                //var totalpatt= new RegExp("^(\-?(\d{0,15}|\d{0,11})(\.\d{0,2})?)$");
                if (attrs.id === 'invval') {
                    var patt15 = /^(\-?(\d{0,13})(\.\d{0,2})?)$/
                }

                if (attrs.name === 'qty') {
                    var patt15 = /^(\-?(\d{0,13})(\.\d{0,2})?)$/
                }
                if(attrs.id === 'val'){
                    var patt15 = /^(\-?(\d{0,11})(\.\d{0,2})?)$/
                }

                if (patt15.test(myval)) {
                    var patt = new RegExp("₹");
                    if (patt.test(myval)) {
                        myval = myval.replace(/\,|₹/g, '');
                    }

                    var myval = myval.toString();

                    if (myval.split('.')[0].length > 14 && attrs.id !== 'invval' && attrs.name !== 'qty') {
                        ctrl.$setViewValue(ctrl.$modelValue);
                        ctrl.$render();
                        return ctrl.$modelValue;
                    }
                    else if (myval.split('.')[0].length > 15 && attrs.id === 'invval') {
                        ctrl.$setViewValue(ctrl.$modelValue);
                        ctrl.$render();
                        return ctrl.$modelValue;
                    }
                    else if (myval.split('.')[0].length > 14 && attrs.name === 'qty') {
                        ctrl.$setViewValue(ctrl.$modelValue);
                        ctrl.$render();
                        return ctrl.$modelValue;
                    }
                    else {
                        ctrl.$render();
                        return myval;
                    }
                }
                else {
                    ctrl.$setViewValue(ctrl.$modelValue);
                    ctrl.$render();
                    return ctrl.$modelValue;
                }
            });
            elem.bind('keypress', function (e) {
                var key = e.keyCode || e.charCode || 0;
                if (key === 46 && parseInt(attrs.fraction, 10) === 0) {
                    e.preventDefault();
                    return false;
                }
                if (key === 46 && this.value.indexOf('.') >= 0) {
                    e.preventDefault();
                    return false;
                }
                if ($.inArray(key, [8, 9, 27, 13, 46]) !== -1 ||
                    // Allow: Ctrl+A, Command+A
                    (key === 65 && (e.ctrlKey === true || e.metaKey === true))) {
                    return;
                }
                //&& (e.keyCode < 96 || e.keyCode > 105)
                if (!attrs.isneg) {
                    if (e.altKey || e.shiftKey || (((key < 48 || key > 57)))) {
                        e.preventDefault();
                        return false;
                    }
                }
                else {
                    if (key !== 45) {
                        if (e.altKey || e.shiftKey || (((key < 48 || key > 57)))) {
                            e.preventDefault();
                            return false;
                        }
                    }
                }
                if (attrs.formatting.length == 0 && this.value > 100) {
                    e.preventDefault();
                    return false;
                }
            });
            // elem.bind('focus', function (e) {
            //     if (parseFloat(ctrl.$modelValue) == 0) {
            //         ctrl.$modelValue = '';
            //         $(elem).val('');
            //     }
            // });
            elem.bind('blur', function (event) {
                var plainNumber = elem.val().replace(/[^\d|\-+|\.+]/g, '');
                //elem.val($filter(attrs.format)(plainNumber, '₹', attrs.fraction));
                //$locale.NUMBER_FORMATS.PATTERNS[0].gSize = 2;
                $locale.NUMBER_FORMATS.PATTERNS[1].gSize = 2;
                scope.$apply(function () {
                    var value1 = parseFloat(plainNumber);
                    if (!isNaN(parseFloat(plainNumber).toFixed(attrs.fraction))) {
                        if (value1 >= 1000000000000000 && attrs.id === 'invval') {
                            var value = parseFloat(parseFloat(plainNumber).toFixed(attrs.fraction)) - 0.10;
                            ctrl.$setViewValue(value);
                        }
                        else if (attrs.name === 'qty') {
                            ctrl.$setViewValue(plainNumber);
                        }
                        else {
                            ctrl.$setViewValue(parseFloat(plainNumber).toFixed(attrs.fraction));
                        }
                    }
                    else {
                        ctrl.$setViewValue("");
                    }

                    if (!isNaN(parseFloat(plainNumber).toFixed(attrs.fraction)) && attrs.formatting && attrs.formatting.length > 0) {
                        if (value1 >= 1000000000000000 && attrs.id === 'invval') {
                            var value = parseFloat(parseFloat(plainNumber).toFixed(attrs.fraction)) - 0.10;
                            elem.val($filter(attrs.formatting)(value.toString(), '', attrs.fraction));// removed ₹ symbol as param for ICR 17052
                        }
                        else if (attrs.name == 'qty') {
                            elem.val(plainNumber);
                        }

                        else {
                            elem.val($filter(attrs.formatting)(plainNumber, '', attrs.fraction));// removed ₹ symbol as param for ICR 17052
                        }

                    }
                    else {
                        elem.val($filter(attrs.formatting)(null, '', attrs.fraction));// removed ₹ symbol as param for ICR 17052
                    }

                });
            });

        }
    };
}]);

//Upload JSon for my master Directive

myApp.directive('fileModelup', ['$q', 'ajax', '$parse', '$http', '$compile', 'utilFunctions', '$timeout', 'cache', function ($q, ajax, $parse, $http, $compile, utilFunctions, $timeout, cache) {
    function getDocSize() {
        if (cache.get('docsize').length > 0) {
            return cache.get('docsize');
        }
        var deferred = $q.defer();
        ajax.get("").then(function (resp) {
            cache.set('docsize', resp.data);
            deferred.resolve(resp.data);
        }, function (err) {
            deferred.reject({
                "error": "Unable to read File Max Size."
            });
        });
        return deferred.promise;
    }

    function link(scope, element, attrs) {
        if (scope.mandatory) {
            scope.required = "required";
        } else {
            scope.required = "";
        }
        scope.abortUpload = function () {
            if (scope.currentConnection) {
                scope.currentConnection.abort();
            }
        };
        scope.getAllowedSize = function () {
            var allow_size = 8192;
            $.map(scope.maxSizeArray, function (upitem) {
                if (upitem.c === scope.docType) {
                    allow_size = parseInt(upitem.n, 10) / 1024;
                }
            });
            return allow_size;
        };
        scope.setError = function (errMsg) {
            $timeout(function () {
                scope.$apply(function () {
                    scope.errVar = errMsg;
                });
            }, 10);
        };
        scope.validateFile = function () {
            scope.setError("");
            var file = element.find("input")[0]['files'][0],
                fileReader = new FileReader(),
                header = "",
                i, type, arr;
            if (file.name && file.name.length > 75) {
                scope.setError("Invalid filename, filename can not exceed 75 characters");
                return false;
            }

            scope.allow_size = scope.getAllowedSize();
            if ((file.size) / 1024 <= scope.allow_size) {
                fileReader.readAsArrayBuffer(file);

                fileReader.onloadend = function (e) {
                    console.log("e:", e)
                    /*  arr = (new Uint8Array(e.target.result)).subarray(0, 4);
                     for (i = 0; i < arr.length; i = i + 1) {
                         header += arr[i].toString(16);
                     }
                     switch (header) {
                         case "89504e47":
                             type = "image/png";
                             break;
                         case "25504446":
                             type = "application/pdf";
                             break;
                         case "7b226773":
                             type = "application/json";
                             break;
                     } */
                    var fileName = file.name;
                    var lastFourChar = fileName.substr(fileName.length - 5);
                    if (lastFourChar === '.json' || lastFourChar === '.JSON') {
                        type = "application/json";
                    }
                    var formdata = new FormData();
                    formdata.append("upfile", file);
                    formdata.append("ty", scope.docType);
                    formdata.append("rtn_typ", scope.formType);
                    formdata.append("ret_period", scope.rtnPrd);
                    if (scope.docType === "ROUZ") {
                        if (type !== "application/json") {
                            $(element).find("input").val('');
                            if (file.type === "application/json" && type !== "application/json") {
                                scope.setError("JSON file uploaded is corrupted");
                            }
                            else {
                                scope.setError("JSON file is only allowed");
                            }
                        } else {
                            scope.setError("");
                            scope.upload(formdata, file.size);
                        }
                    }
                };

            } else {
                $(element).find("input").val('');
                if (scope.allow_size >= 8192) {
                    scope.setError("Only maximum file size of 8MB is allowed");
                } else {
                    scope.setError("Max file upload size is " + (scope.allow_size / 1024) + " MB");
                }
            }
        };
        scope.upload = function (formdata, sz) {
            console.log("formdata", formdata)
            scope.currentConnection = $.ajax({
                type: "POST",
                url: "/importFile",
                enctype: 'multipart/form-data',
                data: formdata,
                headers: {
                    "sz": sz
                },
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: function (request) {
                    //scope.$apply(function () {
                    scope.uploading = true;
                    //});
                    $(element).find("input").attr('disabled', true);
                },
                complete: function () {
                    $(element).find("input").attr('disabled', false);
                },
                success: function (response) {
                    if (response.status == 0) {
                        scope.setError(response.error.user_msg);
                        $timeout(function () {
                            scope.$apply(function () {
                                scope.uploading = false;
                                scope.uploadSuccess = false;
                                scope.progress_bar = "0%";
                            });
                        }, 100);
                    } else {
                        if (!attrs.maxFiles || parseInt(attrs.maxFiles, 10) === 1) {
                            scope.ngModel = [];
                        } else {
                            if (!scope.ngModel) {
                                scope.ngModel = [];
                            }
                        }
                        scope.ngModel.push(response);
                        scope.uploadFile({ 'response': response });
                        $(element).find("input").val('');
                        scope.setError("");
                        $timeout(function () {
                            scope.$apply(function () {
                                scope.uploadSuccess = true;
                                scope.uploading = false;
                                $(element).find("input").attr('disabled', false);
                            });
                        }, 100);
                    }
                },
                error: function (xhr) {
                    if (xhr.status === 403) {
                        $().resetDigest();
                        location.href = "error/accessdenied";
                    }
                    $(element).find("input").val('');
                    scope.setError("Errors encountered while uploading the file");
                    $timeout(function () {
                        scope.$apply(function () {
                            scope.uploading = false;
                            scope.uploadSuccess = false;
                            scope.progress_bar = "0%";
                        });
                    }, 100);
                },
                xhr: function () {
                    var xhr = $.ajaxSettings.xhr(),
                        upperc;
                    xhr.upload.onprogress = function (evt) {
                        $timeout(function () {
                            scope.$apply(function () {
                                upperc = Math.ceil(evt.loaded / evt.total * 100);
                                scope.progress_bar = ((upperc === 100) ? 99 : upperc) + "%";
                            });
                        }, 100);
                    };
                    xhr.upload.onload = function () {
                        //console.log('DONE!') 
                    };
                    return xhr;
                }
            });
        };
        element.bind('change', function () {
            if (scope.docType === "" || !scope.docType) {
                scope.setError("Please select the type of document");
                $(element).find("input").val('');
                return;
            }
            if (typeof getDocSize() === 'object') {
                scope.maxSizeArray = getDocSize();
                scope.validateFile();

            } else {
                getDocSize().then(function (data) {
                    scope.maxSizeArray = data;
                }, function (err) {
                    scope.maxSizeArray = [];

                })['finally'](function () {
                    scope.validateFile();
                });
            }

            if ($("video").length > 0) {
                $("video").fadeOut("slow");
            }
            if ($("canvas").length > 0) {
                $("canvas").fadeOut("slow");
            }
        });
    }
    return {
        restrict: 'E',
        scope: {
            ngModel: '=',
            docType: '=',
            id: '@',
            name: '@',
            maxFiles: '@',
            mandatory: '@',
            uploadFile: '&',
            formType: "=",
            rtnPrd: "="
        },
        template: function (attrs) {
            var output = "<input id='{{id}}' name='{{name}}' type='file' '{{required}}'";
            output += "/><p class='err' data-ng-bind='errVar'></p><div class='progress' data-ng-show='uploading'>" +
                "<div class='progress-bar' ng-class='{\"progress-bar-danger\" : uploadFailed, \"progress-bar-success\" : uploadSuccess}' role='progressbar' style='width:{{progress_bar}}'>{{progress_bar}}</div></div>" +
                "<button type='button' ng-if='uploading' class='btn btn-sm btn-danger' ng-click='abortUpload()'>Cancel Upload</button>";
            return output;
        },
        compile: function (ele) {
            return link;
        }
    };
}]);

/*
Name: autocompleteGstin
description: Directive for Autocomplete input box for SUpplier GSTIN


*/
myApp.directive('autocompleteGstin', ['$q', '$parse', '$http', '$sce', '$timeout', '$templateCache', '$interpolate', '$window', 'shareData', '$location',
    function ($q, $parse, $http, $sce, $timeout, $templateCache, $interpolate, $window, shareData, $location) {
        var KEY_DW = 40,
            KEY_RT = 39,
            KEY_UP = 38,
            KEY_LF = 37,
            KEY_ES = 27,
            KEY_EN = 13,
            MIN_LENGTH = 4,
            BLUR_TIMEOUT = 200;
        function link(scope, elem, attrs, ctrl) {
            var inputField = elem.find('input'),
                minlength = MIN_LENGTH,
                searchTimer = null,
                hideTimer, httpCanceller = null,
                dd = elem[0].querySelector('.autocomplete-dropdown'),
                isScrollOn = false,
                mousedownOn = null,
                displaySearching, displayNoResults, $popup;
            scope.currentIndex = null;
            scope.searching = false;
            scope.selectedResult = false;
            // scope.errorMsg=null
            if (scope.showViewAll === "true" || scope.showViewAll === true) {
                scope.showViewAll = true;
            } else {
                scope.showViewAll = false;
            }

            function clickoutHandlerForDropdown(event) {
                mousedownOn = null;
                scope.hideResults(event);
                document.body.removeEventListener('click', clickoutHandlerForDropdown);
            }

            // for IE8 quirkiness about event.which
            function ie8EventNormalizer(event) {
                return event.which || event.keyCode;
            }

            function extractValue(obj, key) {
                var keys, result, i;
                if (key) {
                    keys = key.split('.');
                    result = obj;
                    for (i = 0; i < keys.length; i = i + 1) {
                        result = result[keys[i]];
                    }
                } else {
                    result = obj;
                }
                return result;
            }

            function extractTitle(data) {
                return scope.titleField.split(',').map(function (field) {
                    return extractValue(data, field);
                }).join(' ');
            }

            function findMatchString(target, str) {
                var result, matches, re;
                re = new RegExp(str.replace(/[.*+?\^${}()|\[\]\\]/g, '\\$&'), 'i');
                if (!target) {
                    return;
                }
                if (!target.match || !target.replace) {
                    target = target.toString();
                }
                matches = target.match(re);
                if (matches) {
                    result = target.replace(re, '<span class="' + scope.matchClass + '">' + matches[0] + '</span>');
                } else {
                    result = target;
                }
                return $sce.trustAsHtml(result);
            }

            function initResults() {
                scope.showDropdown = displaySearching;
                scope.errorMsg = null;
                scope.currentIndex = -1;
                scope.results = [];
            }

            function clearResults() {
                scope.showDropdown = false;
                scope.results = [];
                if (dd) {
                    dd.scrollTop = 0;
                }
            }
			
			function filterResultByCodeLength(responseData, minCodeLength) {
				var regexPattern1Digit = /^[0-9]{1}$/;
				// filter only if minCodeLength is a digit between 0-9
				if (regexPattern1Digit.test(minCodeLength)) {
				    var minCodeLength = parseInt(minCodeLength, 10);
					responseData = responseData.filter(function (element) {
						return element.c.length >= minCodeLength;
					});
				}
				return responseData;
			}

            function processResults(responseData, str) {
                var i, description, text, formattedText, formattedDesc;
				responseData = filterResultByCodeLength(responseData, scope.minCodeLengthToDisplay);
                if (responseData && responseData.length > 0) {
                    scope.results = [];
                    for (i = 0; i < responseData.length; i = i + 1) {
                        if (scope.titleField && scope.titleField !== '') {
                            text = formattedText = extractTitle(responseData[i]);
                        }
                        description = '';
                        if (scope.descriptionField) {
                            description = formattedDesc = extractValue(responseData[i], scope.descriptionField);
                        }
                        if (scope.matchClass) {
                            formattedText = findMatchString(text, str);
                            formattedDesc = findMatchString(description, str);
                        }
                        scope.results[scope.results.length] = {
                            title: formattedText,
                            description: formattedDesc,
                            originalObject: responseData[i]
                        };
                    }
                } else {
                    scope.results = [];
                    // scope.errorMsg = scope.textNoResults
                }
                if (scope.results.length === 0) {
                    scope.noDataFlag({flag:true});
                    scope.showDropdown = false;
                } else {
                    scope.noDataFlag({flag:false});
                    scope.showDropdown = true;
                }
            }

            function cancelHttpRequest() {
                if (httpCanceller) {
                    httpCanceller.resolve();
                }
            }

            function getLocalResults(str) {
                var i, match, s, value, matches, searchFields = [];
                searchFields.push(scope.titleField);
                searchFields.push(scope.descriptionField);
                matches = [];
                for (i = 0; i < scope.localData.length; i = i + 1) {
                    match = false;
                    for (s = 0; s < searchFields.length; s = s + 1) {
                        value = extractValue(scope.localData[i], searchFields[s]) || '';
                        match = match || (value.toString().toLowerCase().indexOf(str.toString().toLowerCase()) >= 0);
                    }

                    if (match) {
                        matches[matches.length] = scope.localData[i];
                    }
                }
                return matches;
            }

            function getRemoteResults(str) {
                var jsonData = JSON.parse(sessionStorage.getItem('supRecipGstin'));
                if(jsonData){
                var completeData = jsonData.supplierRecipientMasters;
               // console.log(JSON.stringify(completeData));
                }
                if (str === "" || str === undefined) {
                    scope.searching = false;
                    return;
                }
                var filteredData = {};
                var list = [];
                if (completeData != undefined && completeData != null) {
                    list = completeData.filter(function(element){ return element.gstin.toUpperCase().substring(0,str.length) == str.toUpperCase() || (element.supplierRecipientName.toUpperCase().indexOf(str.toUpperCase()) >= 0)});
                 }
                filteredData = list;
                scope.searching = false;
                        // Incase HSN failing Hard coded data will be loaded 
                processResults(extractValue(filteredData), str);
            }

            function searchTimerComplete(str) {
                if ((!str || str.length < minlength) && scope.dropdownSearch !== 'true') {
                    return;
                }
                getRemoteResults(str);
            }
            scope.focusHandler = function () {
                if (!scope.showDropdown && scope.dropdownSearch === 'true') {
                    initResults();
                    scope.searchStr = "";
                    scope.searching = true;
                    searchTimerComplete(scope.searchStr);
                }
            };

            function keyupHandler(event) {
                var which = ie8EventNormalizer(event);
                if (which === KEY_LF || which === KEY_RT) {
                    return;
                }
                if (which === KEY_UP || which === KEY_EN) {
                    event.preventDefault();
                } else if (which === KEY_DW) {
                    event.preventDefault();
                    if (!scope.showDropdown && scope.searchStr && scope.searchStr.length >= minlength) {
                        initResults();
                        scope.searching = true;
                        searchTimerComplete(scope.searchStr);
                    }
                } else if (which === KEY_ES) {
                    clearResults();
                    scope.$apply(function () {
                        inputField.val(scope.searchStr);
                    });
                } else {
                    if (minlength === 0 && !scope.searchStr) {
                        return;
                    }
                    if ((!scope.searchStr || scope.searchStr === '') && scope.dropdownSearch !== 'true') {
                        scope.showDropdown = false;
                        scope.ngChange({newGstin: scope.searchStr})
                    } else if (scope.searchStr.length >= minlength) {
                        initResults();
                        if (searchTimer) {
                            $timeout.cancel(searchTimer);
                        }
                        scope.searching = true;
                        searchTimer = $timeout(function () {
                            searchTimerComplete(scope.searchStr);
                            scope.ngChange({newGstin: scope.searchStr})
                        }, scope.pause);
                    }
                }
            }

            function dropdownRowOffsetHeight(row) {
                var css = getComputedStyle(row);
                return row.offsetHeight + parseInt(css.marginTop, 10) + parseInt(css.marginBottom, 10);
            }

            function dropdownHeight() {
                return dd.getBoundingClientRect().top + parseInt(getComputedStyle(dd).maxHeight, 10);
            }

            function dropdownRow() {
                return elem[0].querySelectorAll('.autocomplete-row')[scope.currentIndex];
            }

            function dropdownRowTop() {
                return dropdownRow().getBoundingClientRect().top -
                    (dd.getBoundingClientRect().top +
                        parseInt(getComputedStyle(dd).paddingTop, 10));
            }

            function dropdownScrollTopTo(offset) {
                dd.scrollTop = dd.scrollTop + offset;
            }

            function updateInputField() {
                var current = scope.results[scope.currentIndex];
                if (scope.matchClass) {
                    inputField.val(extractTitle(current.originalObject));
                } else {
                    //inputField.val(current.title);
                    //Fix for assigning HSN code on select
                    inputField.val(current.description);
                }
            }

            function keydownHandler(event) {
                var which = ie8EventNormalizer(event),
                    row = null,
                    rowTop = null;
                if (which === KEY_EN && scope.results) {
                    if (scope.currentIndex >= 0 && scope.currentIndex < scope.results.length) {
                        event.preventDefault();
                        scope.selectResult(scope.results[scope.currentIndex]);
                    } else {
                        event.preventDefault();
                        $timeout.cancel(searchTimer);
                        getRemoteResults(scope.searchStr);
                    }
                    scope.$apply();
                } else if (which === KEY_DW && scope.results) {
                    event.preventDefault();
                    if ((scope.currentIndex + 1) < scope.results.length && scope.showDropdown) {
                        scope.$apply(function () {
                            scope.currentIndex = scope.currentIndex + 1;
                            updateInputField();
                        });
                        if (isScrollOn) {
                            row = dropdownRow();
                            if (dropdownHeight() < row.getBoundingClientRect().bottom) {
                                dropdownScrollTopTo(dropdownRowOffsetHeight(row));
                            }
                        }
                    }
                } else if (which === KEY_UP && scope.results) {
                    event.preventDefault();
                    if (scope.currentIndex >= 1) {
                        scope.$apply(function () {
                            scope.currentIndex = scope.currentIndex - 1;
                            updateInputField();
                        });
                        if (isScrollOn) {
                            rowTop = dropdownRowTop();
                            if (rowTop < 0) {
                                dropdownScrollTopTo(rowTop - 1);
                            }
                        }
                    } else if (scope.currentIndex === 0) {
                        scope.$apply(function () {
                            scope.currentIndex = -1;
                            inputField.val(scope.searchStr);
                        });
                    }
                } else if (which === KEY_ES) {
                    // This is very specific to IE10/11 #272
                    // without this, IE clears the input text
                    event.preventDefault();
                }
            }

            function showAll() {
                if (scope.localData) {
                    scope.searching = false;
                    processResults(scope.localData, '');
                } else {
                    scope.searching = true;
                    getRemoteResults('');
                }
            }
            scope.mouseup = function (e) {
                scope.scroll = false;
            };
            scope.mousedown = function (e) {
                scope.scroll = true;
            };
            scope.hideResults = function (e) {
                if ((mousedownOn && (mousedownOn === scope.id + '_dropdown' || mousedownOn.indexOf('autocomplete') >= 0)) || scope.scroll) {
                    mousedownOn = null;
                } else {
                    hideTimer = $timeout(function () {
                        scope.showDropdown = false;
                        // scope.errorMsg = null;
                        scope.$apply(function () {
                            if (scope.searchStr && scope.searchStr.length > 0) {
                                //
                                function altFind(arr, callback) {
                                    for (var i = 0; i < arr.length; i++) {
                                        var match = callback(arr[i]);
                                        if (match) {
                                            return arr[i];
                                        }
                                    }
                                }
                                const result = altFind(scope.results, function (e) { return e.description === scope.searchStr })
                                // const result = scope.results.find( ({ description }) => description === scope.searchStr  );
                                // if (!result || result.length < 1) { scope.errorMsg = scope.textNoResults }
                                inputField.val(scope.searchStr);
                            }
                        });
                    }, BLUR_TIMEOUT);
                }
            };
            scope.hoverRow = function (index) {
                scope.currentIndex = index;
            };
            scope.viewAll = function () {
                shareData.sacResults = scope.results;
                shareData.searchStr = scope.searchStr;
                shareData.dataObject = scope.dataObject;
                $location.path(scope.viewAllUrl);
            };
            scope.selectResult = function (result) {
                if (scope.matchClass) {
                    result.title = extractTitle(result.originalObject);
                    result.description = extractValue(result.originalObject, scope.descriptionField);
                }
                if (scope.clearResultAfterSelect === 'true' || scope.clearResultAfterSelect === true) {
                    scope.searchStr = "";
                } else {
                    scope.searchStr = result.description;
                }
                //callOrAssign(result.originalObject);
                clearResults();
                scope.selectedResult = true;
                scope.afterSelect({
                    'result': result.originalObject
                });
            };
            scope.resetField = function () {
                scope.selectedResult = false;
                scope.searchStr = "";
                scope.resetResults();
            };
            scope.inputChangeHandler = function (str) {
                // scope.errorMsg = null;
                if (str == "") {
                    scope.ngChange({newGstin: str})
                    scope.showDropdown =false;
                }
                if (str && str.length < minlength) {
                    // scope.errorMsg = "Invalid GSTIN. Enter 1 character";
                    clearResults();
                }
                return str;
            };
            //Gstin color changes
            scope.gstinUser = function (regStatus) {
                let obj = {};
                if(scope.disableAfterSelect == 'true'){
                    if (!regStatus) {
                        obj.color = "orange";
                    }
                    else if (regStatus == 'C') {
                        obj.color = "red";
                    } else if (regStatus != 'C') {
                        obj.color = "green";
                    }
                }
             return obj;
            };
            // check min length
            if (scope.minlength && scope.minlength !== '') {
                minlength = parseInt(scope.minlength, 10);
            }
            // set strings for "Searching..." and "No results"
            scope.textSearching = "Searching..";
            scope.textNoResults = "No Results Found";
            displaySearching = scope.textSearching === 'false' ? false : true;
            displayNoResults = scope.textNoResults === 'false' ? false : true;
            // set max length (default to maxlength deault from html
            scope.maxlength = attrs.maxlength || 10;
            // register events
            inputField.on('keydown', keydownHandler);
            inputField.on('keyup', keyupHandler);
            // set isScrollOn
            $timeout(function () {
                var css = getComputedStyle(dd);
                isScrollOn = css.maxHeight && css.overflowY === 'auto';
            });
        }
        return {
            restrict: 'EA',
            require: 'ngModel',
            scope: {
                dataObject: '=',
                id: '@',
                type: '@',
                placeholder: '@',
                titleField: '@',
                descriptionField: '@',
                pause: '@',
                minlength: '@',
                matchClass: '@',
                inputName: '@',
                afterSelect: '&',
                resetResults: '&',
                clearResultAfterSelect: '@',
                localData: '=',
                viewAllUrl: '@',
                showViewAll: '@',
                disableAfterSelect: '@',
                dropdownSearch: '@',
                searchStr: '=ngModel',
				minCodeLengthToDisplay: '@',
                ngChange: '&',
                disableForEdit: '@',
                noDataFlag : '&'
            
            },
            template: '<div class="autocomplete-holder" data-ng-mouseup="mouseup($event)" data-ng-mousedown="mousedown($event)">' +
                '  <input id="{{id}}_value" name="{{inputName}}"  data-ng-model="searchStr" type="text" placeholder="{{placeholder}}"' +
                'data-ng-blur="hideResults($event)"  data-ng-focus="focusHandler()" maxlength="{{maxlength}}" minlength="{{minlength}}" class="form-control" autocapitalize="off" capitalize="toUpperCase" autocorrect="off" autocomplete="off" data-ng-change="inputChangeHandler(searchStr)" data-ng-style="gstinUser(result.registrationStatus)" data-ng-readonly="disableAfterSelect==\'true\' || disableForEdit==\'true\'" data-ng-disabled="disableForEdit==\'true\'" data-ng-class="{\'hasclear\':disableAfterSelect}"/><span data-ng-if="disableAfterSelect==\'true\' && searchStr.length > 0" data-ng-click="resetField()" style="display: block;float: left;margin-top: 0%;" class="clearer fa fa-close"></span>' +
                '  <div id="{{id}}_dropdown" class="autocomplete-dropdown" ng-show="showDropdown" ng-class="{\'dpdwn\' : !showViewAll && results.length>5 }">' +
                '    <div class="autocomplete-searching" ng-show="searching" ng-bind="textSearching"></div>' +
                '    <div class="autocomplete-row" ng-repeat="result in results" ng-click="selectResult(result)" ' +
                ' ng-mouseenter="hoverRow($index)" title="{{result.title}}" ng-class="{\'autocomplete-selected-row\': $index == currentIndex}">' +
                '      <div ng-if="result.description && result.description != \'\'" class="autocomplete-title" >{{result.description}}-</div>' +
                '      <div class="autocomplete-title" ng-if="dropdownSearch != \'true\' " >{{ result.title | limitTo: 15 }}</div>' +

                '    </div>' +
                '  </div>' +
                '</div>',
            compile: function (tElement) {
                var startSym = $interpolate.startSymbol(),
                    endSym = $interpolate.endSymbol(),
                    interpolatedHtml;
                if (!(startSym === '{{' && endSym === '}}')) {
                    interpolatedHtml = tElement.html().replace(/\{\{/g, startSym).replace(/\}\}/g, endSym);
                    tElement.html(interpolatedHtml);
                }
                return link;
            }
        };
    }
]);
