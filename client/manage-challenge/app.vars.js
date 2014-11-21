(function(window, angular, undefined) {
  'use strict';

  angular.module('manageChallenge')
    .constant("TC_URLS", {
      "baseUrl": "http://tcdev22.topcoder.com/",
      "baseChallengeDetailsUrl": "http://tcdev22.topcoder.com/challenge-details/",
      "baseMemberProfileUrl": "http://tcdev22.topcoder.com/member-profile/",
      "directProjectUrl": "https://qa.topcoder.com/direct/projectOverview.action"
    })
    .constant("TC_DATA_SOURCE", {
    	"challenge": {
    		useLocal: false
    	}
    })
    .constant("TC_SCORING", {
      "MAX_SCORE": 4
    })


})(window, window.angular);