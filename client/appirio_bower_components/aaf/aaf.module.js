(function (window, angular, undefined) {
  'use strict';

  angular.module('tc.aaf', ['tc.aaf.auth'])
    .factory('ConfigService', ConfigService);

    function ConfigService($http, $log, $q, Utils) {
      var deferred = $q.defer();
      var appConfig = {}
      //activate();

      var serviceAPI = {
        activate: activate,
        getAuth0Domain: getAuth0Domain,
        getAuth0ClientId: getAuth0ClientId,
        getWwwUrl: getWwwUrl,
        getBaseChallengeDetailsUrl: getBaseChallengeDetailsUrl,
        getBaseMemberProfileUrl: getBaseMemberProfileUrl,
        getProjectUrl: getProjectUrl
      };

      return serviceAPI;

      function getAuth0Domain() {
        return appConfig.auth0Domain;
      }

      function getAuth0ClientId() {
        return appConfig.auth0ClientId;
      }

      function getWwwUrl() {
        return appConfig.baseUrl;
      }

      function getBaseChallengeDetailsUrl() {
        return appConfig.baseChallengeDetailsUrl;
      }

      function getBaseMemberProfileUrl() {
        return appConfig.baseMemberProfileUrl;
      }

      function getProjectUrl() {
        return appConfig.directProjectUrl;
      }

      function activate() {
        Utils.apiGet('/_api_/config')
          .then(function (data, status, headers, config) {
            appConfig = data;
            deferred.resolve();
          })
          .catch(function (data, status, headers, config) {
            $log.error('Failed to get config from server');
            deferred.reject('Failed to get config from server');
          });
        return deferred.promise;
      }
    }

})(window, window.angular);