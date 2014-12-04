(function(window, angular, undefined) {
  'use strict';

  angular.module('manageChallenge')
    .constant("TC_DATA_SOURCE", {
    	"challenge": {
    		useLocal: false
    	}
    })
    .constant("TC_SCORING", {
      "MAX_SCORE": 4
    })

})(window, window.angular);