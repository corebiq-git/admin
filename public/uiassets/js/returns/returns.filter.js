(function () {
    'use strict';

    var OfflineFilter = angular
        .module('OfflineFilter', ['ng'])

    OfflineFilter.filter('INR', function () {
        return function (input) {
            if (!isNaN(input)) {

                if (input === '0' || input === null) {
                    return 0;
                }
                //var output = Number(input).toLocaleString('en-IN');   <-- This method is not working fine in all browsers!           
                var result = input.toString().split('.');

                var lastThree = result[0].substring(result[0].length - 3);
                console.log(lastThree.length)
                if(lastThree.length <= 3)
                    return lastThree+"."+result[1];
                var otherNumbers = result[0].substring(0, result[0].length - 3);
                if (otherNumbers != '')
                    lastThree = ',' + lastThree;
                var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

                if (result.length > 1) {
                    output += "." + result[1];
                }


                return output;
            }
        }
    });

    OfflineFilter.filter("trust", ['$sce', function ($sce) {
            return function (htmlCode) {
                return $sce.trustAsHtml(htmlCode);
            }
    }]);
    
})();