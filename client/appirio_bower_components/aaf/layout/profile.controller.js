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
  function ProfileController($location, HeaderService, TC_URLS) {
    var vm = this;
    vm.popoverProfile = false;

    //Get Profile Information
    HeaderService.getUserProfile().then(
      function (userProfile) {
        vm.userInfo = userProfile;
      },
      function (data) {

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
      return TC_URLS.baseMemberProfileUrl + memberHandle;
    }

    vm.logoutUrl = function() {
      var currentBaseUrl =  $location.protocol() + '://' + $location.host() + ':' + $location.port();
      return TC_URLS.baseUrl + 'logout?next=' + currentBaseUrl;
    }

  }

})(window, window.angular);