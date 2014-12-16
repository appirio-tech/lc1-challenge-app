//TODO: cleanup; original js file from prototype
(function (window, angular, undefined) {
  'use strict';

  angular.module('tc.aaf')

    .directive('resize', function ($window, matchmedia) {
      return function (scope, element) {
        var w = angular.element($window);
        scope.getWindowDimensions = function () {
          return {'h': w.innerHeight()};
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
          scope.windowHeight = newValue.h;
          scope.tablet = navigator.userAgent.match(/(iPod|iPhone|iPad)/) && matchmedia.isLandscape();
          scope.middle = function (element) {
            if (element) {
              if (newValue.h - angular.element(element).innerHeight() < 0) {
                return {
                  'margin-top': '0px'
                };
              } else {
                return {
                  'margin-top': (newValue.h - angular.element(element).innerHeight()) / 2 + 'px'
                };
              }
            }
          };
          if (!scope.tablet) {
            scope.style = function (element) {
              if (element) {
                return {
                  'height': (newValue.h - $('.panel-heading').outerHeight() - element) + 'px'
                };
              } else {
                return {
                  'height': (newValue.h - $('.panel-heading').outerHeight()) + 'px'
                }
              }
            };
          } else {
            scope.style = function (element) {
              if (element) {
                return {
                  'height': (newValue.h - $('.panel-heading').outerHeight() - element - 20) + 'px'
                };
              } else {
                return {
                  'height': (newValue.h - $('.panel-heading').outerHeight() - 20) + 'px'
                }
              }
            };
          }

        }, true);

      }
    });

})(window, window.angular);