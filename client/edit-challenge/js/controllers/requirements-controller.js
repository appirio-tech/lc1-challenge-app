/**
 * This code is copyright (c) 2014 Topcoder Corporation
 */

(function (window, angular, undefined) {
  'use strict';

  angular
    .module('edit.challenge')
    .controller('RequirementsController', RequirementsController);

  RequirementsController.$inject = ['$scope', 'ChallengeService'];

  function RequirementsController($scope, ChallengeService) {

    if ($scope.challenge.id) {
      ChallengeService.getRequirements($scope.challenge.id).then(function(data) {
        $scope.requirements.requirementList = data;
        if ($scope.requirements.requirementList.length > 0) {
          $scope.requirements.complete = true;
        }
      });
    }

    /*create requirement*/
    $scope.addRequirement = function () {
      if (!$scope.requirements.content) {
        return;
      }
      var requirementData = {
        challengeId: $scope.challenge.id,   // Swagger API requires this!
        requirementText: $scope.requirements.content
      };

      ChallengeService.createRequirement($scope.challenge.id, requirementData)
        .then(function(actionResponse) {
          // get the created requirement
          return ChallengeService.getRequirement($scope.challenge.id, actionResponse.id);
        })
        .then(function(requirement) {
          $scope.requirements.requirementList.push(requirement);
          $scope.requirements.content = '';
          if ($scope.requirements.requirementList.length > 0) {
            $scope.requirements.complete = true;
          }
          return requirement;
        }, function(err) {
          console.log('create requirement: error: ', err);
        })
        ;

    };

    /*save or edit requirement*/
    $scope.saveRequirement = function(requirement) {
      requirement.edit = !requirement.edit;
      if (!requirement.edit) {
        ChallengeService.updateRequirement(requirement).then(function(actionResponse) {
          console.log('saved requirement: ', actionResponse.id);
        }, function(err) {
          console.log('save requirement: error: ', err);
        });
      }
    };

    /*delete requirement*/
    $scope.deleteRequirement = function(requirement) {
      ChallengeService.deleteRequirement(requirement).then(function(data) {
        var index = $scope.requirements.requirementList.indexOf(requirement);
        $scope.requirements.requirementList.splice(index, 1);
        if ($scope.requirements.requirementList.length === 0) {
          $scope.requirements.complete = false;
        }
      }, function(err) {
        console.log('delete requirement: error: ', err);
      });
    };

  }   // end of RequirementsController

})(window, window.angular);