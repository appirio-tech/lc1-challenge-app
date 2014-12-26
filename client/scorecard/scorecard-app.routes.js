(function(window, angular, undefined) {
  'use strict';

  angular.module('manageChallenge')
  .config(ManageChallengeConfig)
  .controller('AppController', AppController)

  function AppController($rootScope, $window, ConfigService) {
    $rootScope.$on("$routeChangeError",
      function (event, current, previous, rejection) {
        $window.location.href = ConfigService.getWwwUrl() + '/404';
      });
  }

  /**
   * @name ManageChallengeConfig
   * @desc
   * @param {!angular.$routeProvider}
   * @param {!angular.$locationProvider}
   * @returns
   * @ngInject
   */
  function ManageChallengeConfig($routeProvider, $locationProvider) {
    $routeProvider

      //show a read-only version of the scorecard for a given submission
      .when("/challenges/:challengeId/scorecards/:scorecardId", {
        controller: "ReadonlyScorecardController",
        controllerAs: "vm",
        templateUrl: "/public/manage-challenge/scorecard/scorecard.html",
        resolve: {
          auth: function getAuth($cookies, $q, $route, $window, ConfigService, Utils) {
            var deferred = $q.defer();

            var token = $window.sessionStorage.token || $cookies.tcjwt;
            if (token) {
              Utils.apiGet('/_auth_/checkAuth/challenges/' + $route.current.params.challengeId + '/scorecards/' + $route.current.params.scorecardId)
              .then(function(check) {
                deferred.resolve(token);
              },
              function(err) {
                deferred.reject(err)
              })
            }
            else {
              ConfigService.activate().then(function() {
                deferred.reject('No auth token')
              });
            }

            return deferred.promise;
          },
          resolvedScorecard: function getScorecard($route, ChallengeService) {
            //allow get scorecard if owner
            return ChallengeService.getScorecard($route.current.params.challengeId, $route.current.params.scorecardId);
          },
          resolvedCurrentChallenge: function getChallenge($route, ChallengeService) {
            //allow get challenge
            return ChallengeService.getChallenge($route.current.params.challengeId);
          }
        }
      });
  }

})(window, window.angular);