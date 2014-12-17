(function (window, angular, undefined) {
  'use strict';

  angular.module('tc.aaf')
    .controller('ProfileController', ProfileController);

/**
   * @name ProfileController
   * @desc Temporary holder for Profile
   * @param {!HeaderService}
   * @returns
   * @ngInject
   */
  function ProfileController($location, $rootScope, $window, HeaderService, ConfigService) {
    var vm = this;
    vm.popoverProfile = false;

    //Get Profile Information
    ConfigService.activate().then(function() {
      HeaderService.getUserProfile().then(
        function (userProfile) {
          vm.userInfo = userProfile;
        },
        function (data) {

        });

    });

    //TODO(DG 12/4/2014): Move this out into separate controller
    $rootScope.$on('Unauthorized', function(msg, data) {
      //console.info('Unauthorized!!');
      var port = '';
      if ($location.port() !== 80) {
        port = ':' + $location.port();
      }

      var redirectUrl;
      var currentBaseUrl =  $location.protocol() + '://' + $location.host() + port;
      //console.log('host, baseUrl', $location.host(), currentBaseUrl);
      if ($location.host().indexOf('topcoder') >= 0) {
        redirectUrl = ConfigService.getWwwUrl() + '?action=showlogin?next=' + currentBaseUrl;
      }
      else {
        redirectUrl = currentBaseUrl + '/login';
      }
      $window.location.href =  redirectUrl;
    });

    //Profile Povover Open
    vm.profile_open = function () {
      vm.popoverProfile = !vm.popoverProfile;
      vm.mobileSearch = false;
    }

    //Profile Popover Hide
    vm.profile_close = function () {
      vm.popoverProfile = false;
    }

    vm.tcMemberProfileUrl = function(memberHandle) {
      return ConfigService.getBaseMemberProfileUrl() + memberHandle;
    }

    vm.logoutUrl = function() {
      var port = '';
      if ($location.port() !== 80) {
        port = ':' + $location.port();
      }

      var currentBaseUrl =  $location.protocol() + '://' + $location.host() + port;
      return ConfigService.getWwwUrl() + '/?action=logout?next=' + currentBaseUrl;
    }

  }

})(window, window.angular);