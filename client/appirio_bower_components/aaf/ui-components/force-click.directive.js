(function (window, angular, undefined) {
  'use strict';

  angular.module('tc.aaf')

    .directive('forceClick', function ($document) {
      return {
        restrict: 'A',
        link: function (scope, elem, attr, ctrl) {
          elem.bind('click', function (e) {
            // this part keeps it from firing the click on the document
            e.stopPropagation();
          });
        }
      }
    });

})(window, window.angular);