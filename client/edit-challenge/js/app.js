/**
 * This code is copyright (c) 2014 Topcoder Corporation
 */

(function (window, angular, undefined) {
  'use strict';

  angular.module('edit.challenge', [

    //3rd party
    'ui.autocomplete',
    'ui.bootstrap',
    'taiPlaceholder',
    'angularFileUpload',
    'restangular',
    'ui.router',

    //custom
    'directives'
  ])

  .config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RestangularProvider',
    function($stateProvider, $locationProvider, $urlRouterProvider, RestangularProvider) {

      $locationProvider.hashPrefix('');

      RestangularProvider.addElementTransformer('requirements', false, function(element) {
        element.edit = false;
        return element;
      })
      .addElementTransformer('prizes', false, function(element) {
        if (element.prize) {
          element.active = true;
        } else {
          element.active = false;
        }
        return element;
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
            challenge: function getChallenge() {
              // return new challenge
              return {
                title: 'Untitled Challenge',
                type: 'Architecture',
                status: 'DRAFT'
              };
            }
          }
        })
        .state('edit-challenge', {
          //url: '/{challengeId:[0-9]{1,9}}',
        //  url: '/challenges/{challengeId:[0-9]{1,9}}/edit',
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
