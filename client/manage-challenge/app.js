(function(window, angular, undefined) {
  'use strict';

  angular.module('manageChallenge', [
    //3rd party
    'ngRoute',
    'ui.bootstrap',
    'matchmedia-ng',
    'taiPlaceholder',
    'ngTable', //TODO(DG: 11/19/2014): replace w/ ng-grid

    'tc.aaf',
    'tc.challenge'
  ])
  .factory('ConfigService', ConfigService);

  function ConfigService($http, $log, Utils) {
    var tcUrls = {}
    activate();

    var serviceAPI = {
      getWwwUrl: getWwwUrl,
      getBaseChallengeDetailsUrl: getBaseChallengeDetailsUrl,
      getBaseMemberProfileUrl: getBaseMemberProfileUrl,
      getProjectUrl: getProjectUrl
    };

    return serviceAPI;

    function getWwwUrl() {
      return tcUrls.baseUrl;
    }

    function getBaseChallengeDetailsUrl() {
      return tcUrls.baseChallengeDetailsUrl;
    }

    function getBaseMemberProfileUrl() {
      return tcUrls.baseMemberProfileUrl;
    }

    function getProjectUrl() {
      return tcUrls.directProjectUrl;
    }

    function activate() {
      Utils.apiGet('/_api_/config')
        .then(function (data, status, headers, config) {
          tcUrls = data;
        })
        .catch(function (data, status, headers, config) {
          $log.error('Failed to get config from server: ');
        });
    }

  }

})(window, window.angular);