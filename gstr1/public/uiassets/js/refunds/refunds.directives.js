(function() {
    'use strict';

    var RfdOfflineDirectives = angular
        .module('RfdOfflineDirectives', ['ng']);

    RfdOfflineDirectives.directive('wrapDirPaginationRfd', function() {
        var directive = {
            restrict: 'E',
            template: '<dir-pagination-controls boundary-links="true" on-page-change="pageChangeHandler(newPageNumber)" template-url="uiassets/javascripts/fwk1/dirPagination/dirPagination.tpl.html"></dir-pagination-controls>'
        };
        return directive;
    });

})();