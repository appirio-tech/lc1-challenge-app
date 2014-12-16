(function (window, angular, undefined) {
  'use strict';

  angular.module('tc.aaf')

    //Custom Checkbox
    .directive('checkbox', function () {
      return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: function (tElement, tAttrs) {
          var custom_true = tAttrs.true ? ' ng-true-value="' + tAttrs.true + '"' : '';
          var custom_false = tAttrs.false ? ' ng-false-value="' + tAttrs.false + '"' : '';
          var more_class = tAttrs.class ? ' ' + tAttrs.class : '';
          return '<label ng-transclude><input type="checkbox" ng-model="' + tAttrs.model + '"' + custom_true + custom_false
            + '><div class="custom-checkbox' + more_class + '"></div>'
        }
      }
    });

})(window, window.angular);