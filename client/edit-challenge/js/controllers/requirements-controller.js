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
        requirementText: $scope.requirements.content
      };
      ChallengeService.createRequirement($scope.challenge.id, requirementData).then(function(data) {
        ChallengeService.getRequirement($scope.challenge.id, data.id).then(function(data){
          $scope.requirements.requirementList.push(data);
          $scope.requirements.content = '';
          if ($scope.requirements.requirementList.length > 0) {
            $scope.requirements.complete = true;
          }
        });
      });

    };

    /*save or edit requirement*/
    $scope.saveRequirement = function(requirement) {
      console.log('saveReq: ', requirement);
      
      requirement.edit = !requirement.edit;
      if (!requirement.edit) {
        ChallengeService.updateRequirement(requirement).then(function(data) {
          console.log('saved requirement: ', requirement.id);
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
      });
    };

  }   // end of RequirementsController

})(window, window.angular);