var refundsApp = angular.module('refundsApp', [
    'ngRoute',
    'RfdOfflineDirectives'
]);

refundsApp.run(function($rootScope) {
    $rootScope.infoRfd = null;

    $rootScope.initRfdInfo = function(iRF, iG, iY, iM, iFlag) {
        $rootScope.infoRfd = {
            form: iRF,
            gstn: iG,
            fy: iY,
            month: iM,
            isUpload: iFlag
        };

        form = iRF;
    };
});

refundsApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/refunds/dashboard', {
            templateUrl: 'pages/refunds/dashboard.html',
            controller: 'refundsdashboardcrtl'
        })
        .when('/refunds/summary', {
            templateUrl: 'pages/refunds/summary.html',
            controller: 'refundssummarycrtl'
        })
        .when('/refunds/preview', {
            templateUrl: 'pages/refunds/preview.html',
            controller: 'refundsprvctrl'
        });
}]);