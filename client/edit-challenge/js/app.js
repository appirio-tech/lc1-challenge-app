/**
 * This code is copyright (c) 2014 Topcoder Corporation
 */

(function (window, angular, undefined) {
  'use strict';

  angular.module('edit.challenge', [

    //3rd party
    'ngRoute',
    'ui.autocomplete',
    'ui.bootstrap',
    'taiPlaceholder',
    'angularFileUpload',
    'restangular',
    'ui.router',
    'ngSanitize',
    'duScroll',
    'growlNotifications',
    'ngTable', //TODO(DG: 11/19/2014): replace w/ ng-grid
    //'ngCookies',
    'tc.aaf',
    'tc.aaf.auth',
    'monospaced.elastic',
    //custom
    'directives'
  ])
  .filter('bytes', function() {
    return function(bytes, precision) {
        if (bytes === 0) { return '0 bytes' }
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
        if (typeof precision === 'undefined') precision = 1;

        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024)),
            val = (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision);

        return  (val.match(/\.0*$/) ? val.substr(0, val.indexOf('.')) : val) +  ' ' + units[number];
    }
  })
  .config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RestangularProvider',
    function($stateProvider, $locationProvider, $urlRouterProvider, RestangularProvider) {

      $locationProvider.hashPrefix('');

      RestangularProvider
        // add a request intereceptor
        .addRequestInterceptor(function(element, operation, what, url) {
          var omitted = _.omit(element, function(value) {
            // - null value causes error on Swagger validation.
            // - Sequelize has an error when an empty array is passed, challenge-service needs a fix for this
            return value === null || _.isArray(value) && _.isEmpty(value);
          });
          return omitted;
        })
        // add a response intereceptor
        .addResponseInterceptor(function(data, operation, what, url, response, deferred) {
          if (data.content) {   // swagger all/get response
            return data.content;
          } else {
            return data;
          }
        });

      // Use $urlRouterProvider to configure redirects(when) and invalid urls(otherwise).
      $urlRouterProvider
        .otherwise('/');

      $stateProvider
        .state('new-challenge', {
          url: '/new',
          templateUrl: 'templates/challenge-edit.html',
          controller : 'CreateChallengeController',
          resolve: {
            config: function getConfig(ChallengeService) {
              return ChallengeService.getConfig();
            },
            challenge: function getChallenge(config) {
              // return new challenge
              return {
                title: config.defaultTitle,
                status: 'DRAFT',
              };
            }
          }
        })
        .state('edit-challenge', {
          url: '/challenges/{challengeId}/edit',
          templateUrl: 'templates/challenge-edit.html',
          controller : 'CreateChallengeController',
          resolve: {
            // resolve challenge by id
            challenge: function getChallenge($stateParams, ChallengeService) {
              return ChallengeService.getChallenge($stateParams.challengeId);
            }
          }
        });
    }

  ]);

})(window, window.angular);
