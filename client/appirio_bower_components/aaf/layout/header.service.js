(function (window, angular, undefined) {
  'use strict';

  var app = angular.module('tc.aaf')
    .service('HeaderService', HeaderService);

  /**
   * @name UserProfileService
   * @desc General Angular Challenge Service
   * @ngInject
   */
  function HeaderService(UserService, Utils) {

    var _useLocal = true;

    var serviceAPI = {
      getUserProfile: getUserProfile
    };

    return serviceAPI;

    /***** Private Functions *****/

	  function getUserProfile() {
      if (_useLocal) {
        return Utils.getJsonData('appirio_bower_components/aaf/layout/data/user-profile.json');
      } else {
        return UserService.getCurrentUser();
      }
    }
  }

})(window, window.angular);