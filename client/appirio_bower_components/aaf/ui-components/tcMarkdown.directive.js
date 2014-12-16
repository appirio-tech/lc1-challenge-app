(function(window, angular, undefined) {
  'use strict';

  angular.module('tc.aaf')


   // markdown Directive
  .directive('tcMarkdown', ['$sanitize', '$log', function($sanitize, $log) {
    var markdownConverter = new window.Showdown.converter({
      extensions: ['github', 'table']
    });
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        if (attrs.tcMarkdown) {
          scope.$watch(attrs.tcMarkdown, function(newVal) {
            if (newVal) {
              var html = $sanitize(markdownConverter.makeHtml(newVal));
              element.html(html);
              angular.element(element).removeClass('previewEmpty');
            } else {
              if (attrs.empty) {
                element.html(attrs.empty);
              } else {
                element.html('--empty--');
              }
              angular.element(element).addClass('previewEmpty');
            }
          });
        } else {
          $log.error('tcMarkdown attribute is not set');
        }
      }
    };
  }]);

})(window, window.angular);
