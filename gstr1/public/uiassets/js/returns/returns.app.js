var myApp = angular.module("returnsApp", [
    'refundsApp',
    'ngRoute',
    'LocalStorageModule',
    'ngProgress',
    'ngTable',
    'ngCsvImport',
    'OfflineFactory',
    'OfflineFilter',
    'OfflineDirectives',
    'PS',
    'angularUtils.directives.dirPagination',
    'ngResource',
    'angularjs-dropdown-multiselect'

]);

var form = null;
myApp.value('version', "3.1.7");
myApp.value('servers', true);

myApp.factory('firebaseAuthInterceptor', ['$q', function ($q) {
    return {
        request: function (config) {
            var url = config.url || '';
            var basePath = window.COREBIQ_BASE_PATH || '';
            if (basePath && url.charAt(0) === '/' &&
                    url !== basePath && url.indexOf(basePath + '/') !== 0) {
                config.url = basePath + url;
                url = config.url;
            }
            var isPublicAsset = /^\/(uiassets|pages|images|lang|data|fonts|stylesheets)\//.test(url);
            if (!window.COREBIQ_REQUIRE_AUTH || !url || url.charAt(0) !== '/' ||
                    isPublicAsset || url === '/health') {
                return config;
            }

            var user = window.firebase && firebase.auth().currentUser;
            if (!user) {
                return $q.reject({
                    status: 401,
                    data: { error: 'authentication_required' },
                    config: config
                });
            }

            return user.getIdToken().then(function (token) {
                config.headers.Authorization = 'Bearer ' + token;
                return config;
            });
        }
    };
}]);

myApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('firebaseAuthInterceptor');
}]);

myApp.run(function ($rootScope) {
    $rootScope.info = null;
    $rootScope.authRequired = window.COREBIQ_REQUIRE_AUTH === true;
    $rootScope.authReady = !$rootScope.authRequired;
    $rootScope.currentUser = $rootScope.authRequired ? null : { localMode: true };
    $rootScope.authError = window.corebiqFirebaseError || null;

    if ($rootScope.authRequired && window.firebase && firebase.apps && firebase.apps.length) {
        firebase.auth().onAuthStateChanged(function (user) {
            $rootScope.$evalAsync(function () {
                $rootScope.currentUser = user;
                $rootScope.authReady = true;
            });
        }, function (error) {
            $rootScope.$evalAsync(function () {
                $rootScope.authError = error.message;
                $rootScope.authReady = true;
            });
        });
    } else if ($rootScope.authRequired) {
        $rootScope.authReady = true;
    }

    $rootScope.logout = function () {
        if (window.firebase && firebase.auth) {
            return firebase.auth().signOut();
        }
    };

    $rootScope.initInfo = function (iR, iG, iY, iM, iFlag) {
        if(iR==='GSTR1IFF')
            iR='GSTR-1/IFF';
        $rootScope.info = {
            form: iR,
            gstn: iG,
            fy: iY,
            month: iM,
            isUpload: iFlag
        };
        if(iR=='GSTR-1/IFF'|| iR=='GSTR1IFF')
        iR='GSTR1';
        
        form = iR;

    }
});

myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/home', {
            templateUrl: 'pages/home.html',
            controller: 'gstrhomectrl'
        })
        .when('/gstr/dashboard', {
            templateUrl: 'pages/returns/dashboard.html',
            controller: 'dashboardcrtl'
        })
        .when('/gstr/masterdashboard', {
            templateUrl: 'pages/returns/masterdashboard.html',
            controller: 'masterdashboardctrl'
        })
        .when('/gstr/upload/upldmstrdashboard', {
            templateUrl: 'pages/returns/upldmstrdashboard.html',
            controller: 'upldmstrdashboardctrl'
        })
        .when('/gstr/summary', {
            templateUrl: 'pages/returns/summary.html',
            controller: 'summarycrtl'
        })
        .when('/gstr/mastersummary', {
            templateUrl: 'pages/returns/mastersummary.html',
            controller: 'mastersummarycrtl'
        })
        .when('/gstr/upload/dashboard', {
            templateUrl: 'pages/returns/uploaddashboard.html',
            controller: 'uploaddashboardctrl'
        })
        .when('/gstr/upload/masterdashboard', {
            templateUrl: 'pages/returns/masterdashboard.html',
            controller: 'uploadmasterdashboardctrl'
        })
        .when('/gstr/upload/summary', {
            templateUrl: 'pages/returns/uploadsummary.html',
            controller: 'uploadsummaryctrl'
        })
        .when('/gstr/error/dashboard', {
            templateUrl: 'pages/returns/errordashboard.html',
            controller: 'errordashboardctrl'
        })
        .when('/gstr/error/summary', {
            templateUrl: 'pages/returns/errorsummary.html',
            controller: 'errorsummaryctrl'
        })
        .when('/gstr/invoices/import', {
            templateUrl: 'pages/returns/importinvoices.html',
            controller: 'importcrtl'
        })
        .when('/gstr/preview', {
            templateUrl: 'pages/returns/preview.html',
            controller: 'prvctrl'
        })
        .when('/gstr/upload/upldmstrpreview', {
            templateUrl: 'pages/returns/upldmstrpreview.html',
            controller: 'upldmstrprvctrl'
        })
        .when('/gstr/upload/preview', {
            templateUrl: 'pages/returns/uploadpreview.html',
            controller: 'uploadprvctrl'
        })
        .when('/gstr/download', {
            templateUrl: 'pages/returns/offline_download.html',
            controller: 'downloadctrl'
        })
        .when('/gstr/items/:id', {
            templateUrl: function (params) {
                switch (params.id) {
                    case "b2b":
                    case "b2ba":
                    case "ecomb2b":
                    case "ecomurp2b":
                    case "ecomab2b":
                    case "ecomaurp2b":
                   
                        if (form == "GSTR1" || form == "GSTR1IFF" || form == "GSTR-1/IFF") {
                            return 'pages/returns/items/items1.html';
                            break;
                        }
                        else {
                            return 'pages/returns/items/items3.html';
                            break;
                        }
                    case "b2cl":
                    case "b2cla":
                        return 'pages/returns/items/items1.html';
                        break;
                    case "b2csa":
                    case "ecomab2c":
                    case "ecomaurp2c":
                        return 'pages/returns/items/items8.html';
                        break;
                    case "exp":
                    case "expa":
                        return 'pages/returns/items/items6.html';
                        break;
                    case "cdnur":
                    case 'cdnr':
                    case "cdnura":
                    case 'cdnra':
                        if (form == "GSTR1" || form == "GSTR1IFF" || form == "GSTR-1/IFF") {
                            return 'pages/returns/items/items1.html';
                            break;
                        }
                        else {
                            return 'pages/returns/items/items5.html';
                            break;
                        }
                    case "b2bura":
                    case "b2bur":
                        return 'pages/returns/items/items3.html';
                        break;
                    case "at":
                    case "ata":
                        return 'pages/returns/items/items9.html';
                        break;
                    case "txi":
                    case "atxi":
                        return 'pages/returns/items/items7.html';
                        break;
                    case "atadj":
                    case "atadja":
                        if (form == "GSTR1" || form == "GSTR1IFF" || form == "GSTR-1/IFF") {
                            return 'pages/returns/items/items2.html';
                            break;
                        } else {
                            return 'pages/returns/items/items7.html';
                            break;
                        }

                    case "imp_g":
                    case "imp_ga":
                    case "imp_s":
                    case "imp_sa":
                        return 'pages/returns/items/items4.html';
                        break;

                }
            },
            controller: 'itmctrl'
        })
        .when('/upload/gstr/items/:id', {
            templateUrl: function (params) {
                switch (params.id) {
                    case "b2b":
                    case "b2ba":
                    case "ecomb2b":
                    case "ecomurp2b":
                    case "ecomab2b":
                    case "ecomaurp2b":
                        if (form == "GSTR1" || form == "GSTR1IFF" || form == "GSTR-1/IFF") 
                        return 'pages/returns/upload/items/items1.html';
                        else if (form == "GSTR1A") return 'pages/returns/upload/items/itemsR1a.html';
                        else return 'pages/returns/upload/items/items3.html';
                        break;

                    case "b2cl":
                    case "b2cla":
                        return 'pages/returns/upload/items/items1.html';
                        break;
                    case "b2csa":
                        case "ecomab2c":
                        case "ecomaurp2c":
                        return 'pages/returns/upload/items/items8.html';
                        break;    
                    case "b2bura":
                    case "b2bur":
                        return 'pages/returns/upload/items/items3.html';
                        break;
                    case "cdnur":
                    case 'cdnr':
                    case "cdnura":
                    case 'cdnra':    
                        if (form == "GSTR1" || form == "GSTR1IFF" || form == "GSTR-1/IFF") return 'pages/returns/upload/items/items1.html';
                        else if (form == 'GSTR1A') return 'pages/returns/upload/items/itemsR1a.html'
                        else return 'pages/returns/upload/items/items5.html';
                        break;
                    case "at":
                    case "ata":
                        return 'pages/returns/upload/items/items9.html';
                        break;
                    case "txi":
                    case "atxi":
                        return 'pages/returns/upload/items/items7.html';
                        break;
                    case "atadj":
                     case "atadja":    
                        if (form == "GSTR1" || form == "GSTR1IFF" || form == "GSTR-1/IFF") {
                            return 'pages/returns/upload/items/items2.html';
                            break;
                        } else {
                            return 'pages/returns/upload/items/items7.html';
                            break;
                        }

                    case "exp":
                    case "expa":
                        return 'pages/returns/upload/items/items6.html';
                        break;
                    case "imp_g":
                    case "imp_ga":
                    case "imp_s":
                    case "imp_sa":
                        return 'pages/returns/upload/items/items4.html';
                        break;

                }
            },
            controller: 'uploaditmctrl'
        })
        .when('/upload/gstr2a/items', {
            templateUrl: "pages/returns/upload/items/gstr2aitems.html",
            controller: 'gstr2aitmctrl'
        })
        .when('/error/gstr/items/:id', {
            templateUrl: function (params) {
                switch (params.id) {
                    case "b2b":
                    case "b2ba":
                    case "ecomb2b":
                    case "ecomurp2b":
                    case "ecomab2b":
                    case "ecomaurp2b":
                        if (form == "GSTR1" || form == "GSTR1IFF" || form == "GSTR-1/IFF") {
                            return 'pages/returns/error/items/items1.html';
                            break;
                        }
                        else {
                            return 'pages/returns/error/items/items3.html';
                            break;
                        }
                    case "b2cl":
                    case "b2cla":
                        return 'pages/returns/error/items/items1.html';
                        break;
                    case "b2csa":
                    case "ecomab2c":
                    case "ecomaurp2c":
                        return 'pages/returns/error/items/items8.html';
                        break;
                    case "cdnr":
                    case "cdnur":
                    case "cdnra":
                    case "cdnura":
                        if (form == "GSTR1" || form == "GSTR1IFF" || form == "GSTR-1/IFF") {
                            return 'pages/returns/error/items/items1.html';
                            break;
                        }
                        else {
                            return 'pages/returns/error/items/items5.html';
                            break;
                        }
                    case "b2bura":
                    case "b2bur":
                        return 'pages/returns/error/items/items3.html';
                        break;
                    case "at":
                    case "ata":
                        return 'pages/returns/error/items/items10.html';
                        break;
                    case "txi":
                    case "atxi":
                        return 'pages/returns/error/items/items7.html';
                        break;
                    case "atadj":
                    case "atadja":
                        if (form == "GSTR1" || form == "GSTR1IFF" || form == "GSTR-1/IFF") {
                            return 'pages/returns/error/items/items2.html';
                            break;
                        } else {
                            return 'pages/returns/error/items/items7.html';
                            break;
                        }
                    case "exp":
                    case "expa":
                        return 'pages/returns/error/items/items6.html';
                        break;
                    case "imp_g":
                    case "imp_ga":
                    case "imp_s":
                    case "imp_sa":
                        return 'pages/returns/error/items/items4.html';
                        break;
                }
            },
            controller: 'erritmctrl'
        })
        .when('/gstr/error/preview', {
            templateUrl: 'pages/returns/errorpreview.html',
            controller: 'errPrvCtrl'
        })
        .when('/gstr/error/:id', {
            templateUrl: function (params) {
                if (form)
                    return 'pages/returns/error/' + form.toLowerCase() + '/' + params.id + '/' + 'summary.html';
            },
            // controller: 'errorsummaryctrl'
            //controller: 'errSummaryCtrl'
            controller: 'errorreturnsctrl'


        })
        .otherwise({
            redirectTo: "/home"
        });
        
}]);

myApp.config(['$httpProvider', function ($httpProvider) {
    if (!$httpProvider.defaults.headers.common) {
        $httpProvider.defaults.headers.common = {};
    }
    $httpProvider.defaults.headers.common["Cache-Control"] = "no-cache";
    $httpProvider.defaults.headers.common.Pragma = "no-cache";
    $httpProvider.defaults.headers.common["If-Modified-Since"] = "0";
}]);




//footer hanler
(function () {
    // body...
    var resize = true;
    window.onresize = function (event) {
        if (resize) {
            resize = false;
            setTimeout(function () {
                $("#rtContainer").css({
                    "min-height": window.innerHeight - ($("header").height() + 8) - $("#rtNavbar").height() - $("footer").height()
                });
                resize = true;
            }, 300)
        }
    };

    try {
        window.dispatchEvent(new Event('resize'));
    } catch (e) { }
})();






function FileSelected(a, b) {
    var allowedFiles = b.split(',');
    var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(" + allowedFiles.join('|') + ")$");
    if (!regex.test(a.value.toLowerCase())) {
        alert('File type not allowed');
        return false;
    }
    return true;
}




function FileSelectedcheck(a, b) {
    var allowedFiles = b.split(',');
    var regex = new RegExp("([a-zA-Z0-9()\s_\\.\-:])+(" + allowedFiles.join('|') + ")$");
    if (!regex.test(a.toLowerCase())) {
        // alert('File type not allowed');
        return false;
    }
    return true;
}
