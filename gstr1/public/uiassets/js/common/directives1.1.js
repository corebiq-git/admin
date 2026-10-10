/*jslint browser: true, sloppy:true, nomen: true, node: true, bitwise: true, regexp: true*/
/*global $, jQuery, angular, myApp, regex, transctrl, accessctrl, translationSrv, RouteProviderConfig, moment, WebSocket, Uint8Array, FileReader, MediaStreamTrack, console, getComputedStyle, FormData*/

/**
 *  @author:    Sri Harsha Samineni
 *  @created:   Sep 2016
 *  @description: Commonly used angular factories, services, modules, and functionality for FO User services
 *  @copyright: (c) Copyright by Infosys technologies
 *  Revision 1.2 
 *  Last Updated: Sri Harsha, Dec 19 2017
 **/


"use strict";
// RouteProviderConfig.$inject = ['$routeProvider', '$locationProvider'];
// myApp.config(RouteProviderConfig);

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
            var h = 0, strlen = str.length, i, n;
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
            //console.log([].slice.call(arguments))

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
	if (document.all && !window.localStorage)
	{
		window.localStorage = {};
		window.localStorage.removeItem = function () { };
	}
	
    //this.ttl = 3 * 60 * 60; // 3 hours by default
    this.ttl = $().getConstant("LCACHE_MIN_TIME");
    this.set = function (key, value, expire) {
        localStorageService.set(key, {
            data: value,
            timestamp: new Date().getTime(),
            ttl: (expire || this.ttl) * 1000
        });
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
			if (new Date().getTime() > (key.timestamp + key.ttl)) {
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
        pan: /^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/,
        mobile: /^[1-9][0-9]*$/,
        //        email: /^[a-zA-Z0-9._]+@[a-z]+\.[a-z.]{2,5}$/,
        email: /^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/,

        captcha: /^([0-9]){6}$/,
        passport: /^[A-PR-WYa-pr-wy][1-9]\d\s?\d{4}[1-9]$/,
        piocard: /^[pP]\d{7}$/,
        gstin: /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9a-zA-Z]{1}/,
        provisional: /[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9A-Za-z]{1}[Z]{1}[0-9a-zA-Z]{1}/ | /^[0-9]{4}[A][R][0-9]{7}[Z]{1}[0-9]{1}/ | /^[0-9]{2}[a-zA-Z]{4}[0-9]{5}[a-zA-Z]{1}[0-9]{1}[Z]{1}[0-9]{1}/ | /^[0-9]{4}[a-zA-Z]{3}[0-9]{5}[0-9]{1}[Z]{1}[0-9]{1}/,
        number: /^[0-9]*$/,
        fo_otp: /^[0-9]+$/,
        pincode: /^[0-9]{6}$/,
        aadhar: /\d{12}$/,
        fo_user: /^[a-zA-Z][a-zA-Z0-9_\.\-]*$/,
        fo_password: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\@\!\#\%\^\$\&\`\*\-\_\+])(?=.*[a-zA-Z0-9\@\!\#\%\^\$\&\`\*\-\_\+]*$).{8,15}/,
        fo_secans: /^[a-zA-Z0-9@._*\/\-]+(\s+[a-zA-Z0-9@._*\/\-\s]+)*$/,
		otp: /^[0-9]{6}$/,

        svat: /^[A-Za-z0-9\/]{6,25}$/,
        cst: /^[A-Za-z0-9]{6,25}$/,
        et: /^[A-Za-z0-9]{6,25}$/,
        ent: /^[A-Za-z0-9]{6,25}$/,
        hlt: /^[A-Za-z0-9]{6,25}$/,
        ce: /^[A-Za-z0-9]{6,25}$/,
        svtax: /^[A-Za-z0-9]{6,25}$/,
        cin: /^[A-Za-z0-9\-]{6,25}$/,
        llp: /^[A-Za-z0-9\-]{6,25}$/,
        iec: /^[A-Za-z0-9]{6,25}$/,
        mnt: /^[A-Za-z0-9]{6,25}$/,
		globalpassport: /^[A-Za-z0-9 -\/]{8,15}$/,

        name: /^[a-zA-Z0-9\_\-\.\/\, ]{1,99}$/,
        buidno: /^[a-zA-Z0-9 \/_\-\,\.]{1,60}$/,
        floorno: /^[a-zA-Z0-9\-\\\/\.\, ]{1,60}$/,
        faxno: /^[0-9]{11,16}$/,
        tName: /^[a-zA-Z0-9\_\-\/.,&%$ ]{1,99}$/,
        din: /^[0-9]{8}$/,
        acno: /^[A-Za-z0-9]{6,20}$/,

        pwdtooltip_user: /^([a-zA-Z0-9\_\-\.]){8,15}$/,
        pwdtooltip_uppercase: /[A-Z]/,
        pwdtooltip_lowercase: /[a-z]/,
        pwdtooltip_num: /[0-9]/,
        pwdtooltip_symbol: /[\@\!\#\%\^\$\&\`\*\-\_\+]+/,
        pwdtooltip_pwd: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*^[a-zA-Z0-9\@\!\#\%\^\$\&\`\*\-\_\+]*$).{8,15}/

    };
    this.maxlength = {
        pan: "10",
        mobile: "10",
        email: "",
        captcha: "6",
        passport: "",
        piocard: "7",
        gstin: "",
        number: "",
        fo_otp: "",
        pincode: "6",
        aadhar: "12",
        fo_user: "",
        fo_password: "15",
        fo_secans: "",
        svat: "25",
        cst: "25",
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
        name: "60",
        buidno: "60",
        floorno: "60",
        faxno: "16",
        tName: "99",
        din: "8",
        acno: "20"
    };
    this.messages = {
        pan: "ERR_PAN",
        mobile: "ERR_MBL_FRMT",
        email: "ERR_EMAIL_FRMT",
        captcha: "ERR_CAPTCHA_FRMT",
        passport: "Invalid Passport Number",
        piocard: "Invalid PIO Card Number",
        gstin: "",
        number: "Invalid Number, please enter digits only",
        pincode: "Enter valid PIN code",
        aadhar: "Invalid aadhar, Please enter 12 digit aadhar number",
        svat: "Invalid entry, Please enter 6-25 alphanumeric state VAT registration number",
        cst: "Invalid entry, Please enter 6-25 character central sales tax number",
        et: "Invalid entry, Please enter 6-25 alphanumeric registration no.",
        ent: "Invalid entry, Please enter 6-25 alphanumeric registration no.",
        hlt: "Invalid entry, Please enter 6-25 alphanumeric registration no.",
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

        var factor = 2, sum = 0, checkCodePoint = 0, i, j, digit, mod, codePoint, cpChars, inputChars;
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
        var serverInt = setInterval(function () {
            if ($rootScope.servers !== undefined) {
                if ($route.current.$$route.isStatic) {
                    $http({
                        url: $rootScope.servers.GST_SERVICES_R1_URL + "/services/auth/api/isauthorized",
                        withCredentials: true
                    }).then(function () {}, function (err) {
                        if (err.status === 403) {
                            $().resetDigest();
                            location.href = "error/accessdenied";
                        }
                    });
                }
                clearInterval(serverInt);
            }
        }, 10);
    };
    this.post = function (url, data, headers, beforeSend, complete, ignoreDuplicate) {
        var deferred = $q.defer(), ajax = this;
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
                "msg": "System Error: Unable to load data. " + error.status + " : " + ajax.getErrorMessage(error.status) + "."
            });
        })['finally'](function () {
            $().resetAlive();
        });
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
                "msg": "System Error: Unable to load data. " + error.status + " : " + ajax.getErrorMessage(error.status) + "."
            });
            if (ajax.pendingReq() === 0) {
                setTimeout(function () {
                    $rootScope.$emit("errors", {});
                }, 1000);

            }
        })['finally'](function () {
            $().resetAlive();
        });
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

myApp.directive('datepicker', ['$compile', 'utilFunctions', function ($compile, utilFunctions) {
    return {
        link: function (scope, element, attrs) {
            var dateFormat = "DD/MM/YYYY", returnPeriod = null, firstMonth = null;

            if(scope.monthList){
                 firstMonth = scope.monthList[0];
            }
            if (scope.dashBoardDt.fp) {
                returnPeriod = scope.dashBoardDt.fp
            }
            else{     
                var DD= new Date(),
                    MM = DD.getMonth(),
                    YYYY = DD.getFullYear();
                
                returnPeriod = MM+""+YYYY;
            }
            
            $(element).datepicker({
                'clearButton': true
            });
			$(element).mask("99/99/9999", {placeholder: $().getConstant('DATE_FORMAT')});
            
            
            element.bind('blur', function (e) {
               var entVal = element.val(),
                   entDt = moment(entVal, dateFormat, true),
                   isValidDate = entDt.isValid();
                
                if(isValidDate){
                    
                    var temp = "01" + returnPeriod.slice(0, 2) + returnPeriod.slice(2);
                    
                    var lastDate = moment(temp, dateFormat).add(1, 'months').subtract(1, 'days');
                    var FormatedLastDate = lastDate.format(dateFormat);
                    var today = moment().format(dateFormat);
                   // var firstMonth = $scope.monthList[0],
                       var temp1 = "01" + firstMonth.value.slice(0, 2) + firstMonth.value.slice(2),
                        firstDate = moment(temp1, dateFormat),
                        firstDate1 = firstDate.format(dateFormat);

                    if (moment(FormatedLastDate, dateFormat).isAfter(moment(today, dateFormat))) {
                        FormatedLastDate = moment().format(dateFormat);
                    }
                    
                    if (entDt.isAfter(moment(FormatedLastDate, dateFormat))) {
                        element.val("");
                    }
                    if (entDt.isBefore(moment(firstDate1, dateFormat))) {
                        element.val("");
                    }
                }
                else{
                    element.val("");
                }
            });
        }
    };
}]);
myApp.directive('pan', function () {
    return {
        link: function (scope, element, attrs) {
            $(element).mask("aaaaa9999a", {"placeholder": "", autoclear: false});
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
        template: '<div id="confirmDlg" class="modal fade fade-scale" role="dialog"><div class="modal-dialog sweet"><div class="modal-content"><div class="modal-body"><div class="m-icon m-warning pulseWarning"><span class="micon-body pulseWarningIns"></span><span class="micon-dot pulseWarningIns"></span></div><h2>{{title}}</h2><p ng-bind-html="message|trust"></p></div><div class="modal-footer"><a class="btn btn-default" data-dismiss="modal" ng-if="cancelTitle!==\'null\'">{{cancelTitle}}</a><a class="btn btn-primary" ng-click="callback()" target="_blank" >{{okTitle}}</a></div></div></div></div>'
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
        template: '<div id="errorDlg" class="modal fade fade-scale" role="dialog"><div class="modal-dialog sweet"><div class="modal-content"><div class="modal-body"><div class="m-icon m-error"><span class="x-mark"><span class="m-line m-left"></span><span class="m-line m-right"></span></span></div><h2>{{title}}</h2><p ng-bind-html="message|trust"></p></div><div class="modal-footer"><a class="btn btn-default" data-dismiss="modal">{{cancelTitle}}</a></div></div></div></div>'
    };
});
myApp.directive('successDialogue', function () {
    return {
        restrict: "E",
        scope: {
            title: "@",
            message: "@"
        },
        template: '<div id="successDlg" class="modal fade fade-scale" role="dialog"><div class="modal-dialog sweet"><div class="modal-content"><div class="modal-body"><div class="m-icon m-success loaded"><span class="m-line m-tip animateSuccessTip"></span><span class="m-line m-long animateSuccessLong"></span><div class="m-placeholder"></div><div class="m-fix"></div></div><h2>{{title}}</h2><p ng-bind-html="message|trust"></p></div></div></div></div>'
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


if (!String.prototype.repeat) {
    String.prototype.repeat = function (count) {
        if (this === null) {
            throw new TypeError('can\'t convert ' + this + ' to object');
        }
        var rpt = '', str = "" + this;
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
        
        for (;;) {
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


myApp.factory('utilFunctions', ["$q", "$log", "cache", "version", "$rootScope", function ($q, $log, cache, version, $rootScope) {
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
            $("confirm-dialogue,error-dialogue,success-dialogue").remove();
            $(".modal-backdrop").remove();
            $("body").css("padding-right", "0").removeClass("modal-open");
            switch (config.type) {
			case 'Warning':
				return ("<confirm-dialogue data-title='" + config.title + "' data-message='" + config.message + "' data-callback=\"" + config.callback + "()\" data-ok-title='" + config.ok_btn_title + "' data-cancel-title='" + config.cancel_btn_title + "'></confirm-dialogue>");
			case 'Error':
				return ("<error-dialogue data-title='" + config.title + "' data-message='" + config.message + "' data-cancel-title='" + config.cancel_btn_title + "'></error-dialogue>");
			case 'Success':
				return ("<success-dialogue data-title='" + config.title + "' data-message='" + config.message + "'></success-dialogue>");
            }

        },
        _destroyDialogue: function () {
            var x = $("confirm-dialogue,error-dialogue,success-dialogue");
            
            setTimeout(function () {
                x.remove();
                $(".modal-backdrop").remove();
                $("body").removeClass("modal-open");
                $("body").css("padding-right", "0");                
            }, 400);

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
                conn = new WebSocket("wss://127.0.0.1:" + port);
                conn.onerror = function () {
                    $log.debug("Call Err:" + port);
                    deferred.reject({
                        "status": "404",
                        "error": "Connection Failed"
                    });
                    return deferred.promise;
                };
                conn.onopen = function () {
                    $log.debug("Call Opened:" + port);
                    deferred.resolve(conn);
                    //$log.log(conn);
                };
            } catch (e) {
                deferred.reject({
                    "status": "404",
                    "error": "Connection Failed"
                });
            }
            return deferred.promise;

        },
        connectEmsigner: function () {
            //var connPorts = [1645, 8080, 1812, 2083, 2948], conn, retVar, deferred = $q.defer(), ccount = 0, utilFun = this;
            var connPorts = $().getConstant("EM_PORTS").split(","), conn, retVar, deferred = $q.defer(), ccount = 0, utilFun = this;

            function connect() {
                //console.log("connecting.." + connPorts[ccount]);
                conn = utilFun.emSignerConn(connPorts[ccount]);
                conn.then(function (data) {
                    deferred.resolve(data);
                }, function (err) {
                    if (ccount <= connPorts.length) {
                        ccount++;
                        connect();
                    } else {
                        deferred.reject(err);
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
        if ($route.current.$$route) {
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
					//sachin
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
        template: '<ol class="breadcrumb" data-ng-controller="crumbCtrl"><li><a target="{{target}}" href="{{path}}" data-ng-bind="name"></a></li><li data-ng-repeat="breadcrumb in breadcrumbs.getAll()"><ng-switch on="$last"> <span ng-switch-when="true">{{breadcrumb.n}}</span> <span ng-switch-default><a target="_self" href="/{{breadcrumb.u}}" data-ng-bind="breadcrumb.n"></a></span> </ng-switch></li></ol>',
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
        template: '<div id="myModal" class="modal fade" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header">                       <button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">{{type}}</h4></div><div                                class="modal-body"><p>{{message}}</p></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>',
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
            config.timeout = 10000000; // REQUIRED FOR EXCEL IMPORT
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
            if (rejection.status === 403) {
                $().resetDigest();
                location.href = "error/accessdenied";
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
            $().reposFooter();
        }, 1000);
        $(".navbar-collapse").removeClass("in");
    });

    $rootScope.$on('$routeChangeError', function () {
        $rootScope.progressbar.complete();
        $(".navbar-collapse").removeClass("in");
    });
	
	if(window.constants && Object.keys(window.constants).length > 0) {
		$.each(window.constants, function (key, value) {
			$().setConstant(key, value);
		});	
	}
}]);

myApp.directive('photoModel', ['ajax', '$q', '$parse', function (ajax, $q, $parse) {
    return {
        restrict: 'A',
        scope: {
            callback: '&',
            angModel: '=',
            loadingEle: '@',
            maxFiles: '@'
        },
        link: function (scope, element, attrs) {
            element.bind("click", function (e) {
                var canvas = document.getElementById("canvas"),
                    file = canvas.toDataURL("image/jpeg"),
                    formdata = {},
                    deferred = $q.defer();
                formdata.upfile = file;
                formdata.applnid = attrs.applId;
                formdata.ty = attrs.docType;

                ajax.post("/document/2/b64", formdata, {}, function () {
                    $("#" + attrs.loadingEle).show();
                }, function () {
                    $("#" + attrs.loadingEle).hide();
                }).then(function (data) {
                    deferred.resolve(data);
                }, function (err) {
                    deferred.reject({
                        "error": "Error occured"
                    });
                });


                deferred.promise.then(function (data) {
                    setTimeout(function () {
                        scope.$apply(function () {
                            if (!attrs.maxFiles || parseInt(attrs.maxFiles, 10) === 1) {
                                scope.angModel = [];
                                scope.angModel.push(data);
                            } else {
                                if (scope.angModel) {
                                    scope.angModel.push(data);
                                } else {
                                    scope.angModel = [];
                                    scope.angModel.push(data);
                                }
                            }
                        });
                        scope.callback();
                    }, 300);
                });


                e.preventDefault();
            });
        }
    };
}]);
myApp.directive('selectConfirm', ['utilFunctions', '$compile', function(utilFunctions, $compile){
    function link(scope, element, attrs) {
        scope.confirmFunction = function () {
            scope.callBack();
        }
        scope.cancel = function () {
            scope.ngModel = undefined;
            element.val('');
        }
        element.bind('blur', function(evt){
            var html = '<div id="stcnfDlg" class="modal fade fade-scale" role="dialog"><div class="modal-dialog sweet"><div class="modal-content"><div class="modal-body"><div class="m-icon m-warning pulseWarning"><span class="micon-body pulseWarningIns"></span><span class="micon-dot pulseWarningIns"></span></div><h2>Warning</h2><p>State once selected cannot be changed</p></div><div class="modal-footer"><a class="btn btn-default" data-dismiss="modal" ng-click="cancel()">Cancel</a><a class="btn btn-primary" data-dismiss="modal" ng-click="confirmFunction()">Proceed</a></div></div></div></div>';
            $('body').append($compile(html)(scope));
            $("#stcnfDlg").modal('show');
        });
    }
    return {
        restrict: "A",
        scope: {
            ngModel: '=',
            callBack: '&'
        },
        compile: function() {
            return link;
        }
    }
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
            var file = element.find("input")[0]['files'][0], fileReader = new FileReader(), header = "", i, type, arr;
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
                    scope.setError("Max file upload size is 1 MB");
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
                        show:true,
                        backdrop:'static'
                        
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
        var canEnumerate = false, deferred = $q.defer(), con = {camera: false}, x, i, device;
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

        $("#" + canvas).fadeOut("slow", function () {
            $("#" + videoEle).fadeIn();
        });
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
myApp.directive('accessibleForm', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            attrs.$set('autocomplete', "off");
            attrs.$set('novalidate', "");
            elem.on('submit', function () {
                var firstInvalid = elem[0].querySelector('.ng-invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
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
            'data-ng-blur="hideResults($event)"  data-ng-focus="focusHandler()" maxlength="{{maxlength}}" class="form-control" autocapitalize="off" autocorrect="off" autocomplete="off" data-ng-change="inputChangeHandler(searchStr)" data-ng-readonly="disableAfterSelect && selectedResult" data-ng-class="{\'hasclear\':disableAfterSelect}"/><span data-ng-if="disableAfterSelect && searchStr.length > 0 && selectedResult" data-ng-click="resetField()" class="clearer fa fa-close"></span>' +
            '  <div id="{{id}}_dropdown" class="autocomplete-dropdown" ng-show="showDropdown" ng-class="{\'dpdwn\' : !showViewAll && results.length>5 }">' +
            '    <div class="autocomplete-searching" ng-show="searching" ng-bind="textSearching"></div>' +
            '    <div class="autocomplete-searching" ng-show="!searching && (!results || results.length == 0)" ng-bind="textNoResults"></div>' +
            '    <div class="autocomplete-row" ng-repeat="result in results | limitTo: showViewAll ? 5 : results.length" ng-click="selectResult(result)" ' +
            ' ng-mouseenter="hoverRow($index)" ng-class="{\'autocomplete-selected-row\': $index == currentIndex}">' +
            '      <div class="autocomplete-title" ng-if="matchClass && dropdownSearch != \"true\" "  ng-bind-html="result.title"></div>' +
            '      <div class="autocomplete-title" ng-if="!matchClass&& dropdownSearch != \"true\" ">{{ result.title }}</div>' +
            '      <div ng-if="matchClass && result.description && result.description != \'\'" class="autocomplete-desc" ng-bind-html="result.description"></div>' +
            '      <div ng-if="!matchClass && result.description && result.description != \'\'" class="autocomplete-desc">{{result.description}}</div>' +
            '    </div>' +
            '<div class="autocomplete-dropdown-all" ng-show="showDropdown && results.length>5 && showViewAll"><p ng-click="viewAll()"> View All</p></div>' +
            '  </div>' +
            '</div>');

        function link(scope, elem, attrs, ctrl) {
            var inputField = elem.find('input'), minlength = MIN_LENGTH, searchTimer = null, hideTimer, httpCanceller = null, dd = elem[0].querySelector('.autocomplete-dropdown'), isScrollOn = false, mousedownOn = null, displaySearching, displayNoResults, $popup;
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

myApp.directive('attachDsc', ['ajax', 'utilFunctions', '$compile', '$timeout',
    function (ajax, utilFunctions, $compile, $timeout) {

        function link(scope, elem, attrs) {
            //console.log("inside directive")
            //utilFunctions.connectEmsigner()
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
                        if (resp.data === "signing canceled") {
                            $().blockPage(false);
                            //console.log("WebSocket Closed");
                            scope.$apply(function () {
                                scope.waitMessage = "Cancelled";
                                scope.disableEle = false;
                                scope.resClass = "alert-danger";
                            });
                        } else if (resp.data.indexOf("status = success") > -1) {
                            //console.log("Opened");
                            $().blockPage(false);
                        } else {
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
                                    scope.successCallBack();
                                } else {
                                    scope.waitMessage = response.message;
                                    scope.disableEle = false;
                                    scope.resClass = "alert-danger";
                                }
                            }, function () {
                                $().blockPage(false);
                                scope.waitMessage = "Error Occured.";
                                scope.disableEle = false;
                                scope.resClass = "alert-danger";
                            });
                        }
                    };
                };
                ajax.post(scope.userAuth, {
                    "pan": scope.panAuth
                }, {}, function () {
                    $().blockPage(true);
                    scope.waitMessage = "Connecting to server";
                }).then(function (data) {
                    if (data.stscd === "FAILURE") {
                        scope.waitMessage = "The DSC you are trying to affix is not registered at the portal. Kindly register the DSC first or use another DSC which is registered in the portal.";
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
                                    scope.waitMessage = "Unable to connect to the installed EMSigner. Please close any other application running on following ports 8080, 1645, 1812, 2083 and restart your system, and try again.";
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
                        "message": "These informations are being collected under the Provisions of the Proposed Goods and Services Tax Act, 2016. Since All filled information along with annexure are subject to verification in the GST regime, therefore, in case of misleading / wrong / incorrect information with / without evidence shall attract provisions of cancellation as per the Provisions of Proposed Goods and Services Tax Act, 2016",
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
                return $filter(attrs.format)(ctrl.$modelValue, '₹', attrs.fraction);
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
                if (e.altKey || e.shiftKey || (((key < 48 || key > 57)))) {
                    e.preventDefault();
                    return false;
                }
            });
            elem.bind('blur', function (event) {
                var plainNumber = elem.val().replace(/[^\d|\-+|\.+]/g, '');
                //elem.val($filter(attrs.format)(plainNumber, '₹', attrs.fraction));
                //$locale.NUMBER_FORMATS.PATTERNS[0].gSize = 2;
                $locale.NUMBER_FORMATS.PATTERNS[1].gSize = 2;
                scope.$apply(function () {
					if(!isNaN(parseFloat(plainNumber).toFixed(attrs.fraction))) {
						ctrl.$setViewValue(parseFloat(plainNumber).toFixed(attrs.fraction));	
					}
					
					if(parseFloat(ctrl.$modelValue)> 0) {
						elem.val($filter(attrs.format)(plainNumber, '₹', attrs.fraction));	
					}
                    /*ctrl.$render = function () {
                        elem.val($filter(attrs.format)(plainNumber, '₹', attrs.fraction));
                        //ctrl.$setViewValue($filter(attrs.format)(plainNumber, '', attrs.fraction));
                        ctrl.$setViewValue(parseFloat(plainNumber).toFixed(attrs.fraction));
                    };
                    ctrl.$render();*/
                });
            });
        }
    };
}]);


myApp.filter('words', function () {
	function isInteger(x) {
		return x % 1 === 0;
	}
	function fract(n) {
		return Number(String(n).split('.')[1] || 0);
	}
	return function (value) {
		function toWords(a) {
			if (0 > a || $().getConstant("PAYMENT_MAX_NUM") < a) {
				return "Number is out of range";
			}
			var b = "", c, d, e, f, g;
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
			d = "  Twenty Thirty Fourty Fifty Sixty Seventy Eigthy Ninety".split(" ");
			if (0 < e || 0 < a) {
				2 > e ? b += c[10 * e + a] : (b += d[e], 0 < a && (b += "-" + c[a]));
			}
			"" == b && (b = "null");
			return b;
      	}
    //if(value%1)
    
    if (value && isInteger(value) && !isNaN(value)) {
        return  toWords(value) + "Rupees only";
    }
	if(toWords(fract(parseFloat(value % 1).toFixed(2))) != null) {
		return  toWords(parseFloat(value).toFixed(2)) + "Rupees and " + toWords(fract(parseFloat(value % 1).toFixed(2))) + " Paise only";
	}
    
  };

});
myApp.directive('checkList', function() {
  return {
    scope: {
      checkList: '=',
      value: '@'
    },
    link: function(scope, elem, attrs) {
		
      var handler = function(setup) {
		  console.log(scope.checkList)
		  var checked = elem.prop('checked');
		  var index = scope.checkList.indexOf(scope.value);

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
            
      elem.on('change', function() {
        scope.$apply(changeHandler);
      });
      scope.$watch('checkList', setupHandler, true);
    }
  };
});