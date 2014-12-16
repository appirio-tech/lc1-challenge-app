(function (window, angular, undefined) {
  'use strict';

  angular.module('tc.aaf')

    //Custom Filtering
    //reference:http://stackoverflow.com/questions/14782439/removing-angularjs-currency-filter-decimal-cents
    .filter('noFractionCurrency',
      [ '$filter', '$locale',
      function(filter, locale) {
        var currencyFilter = filter('currency');
        var formats = locale.NUMBER_FORMATS;
        return function(amount, currencySymbol) {
          var value = currencyFilter(amount, currencySymbol);
          var sep = value.indexOf(formats.DECIMAL_SEP);
          if(amount >= 0) {
            return value.substring(0, sep);
          }
          return value.substring(0, sep) + ')';
        };
      } ]);


})(window, window.angular);