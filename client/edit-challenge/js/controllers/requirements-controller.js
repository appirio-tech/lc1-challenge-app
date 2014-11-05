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
          angular.forEach($scope.requirements.requirementList, function(requirement){
            requirement.editRequirementText = requirement.requirementText;
            requirement.edit = false;
          });
        }
      }, function(response){
        console.log('Fail to get all requirements: %o', response.data);
      });
    }

    /*create requirement*/
    $scope.isUploading = false;
    $scope.addRequirement = function () {
      if (!$scope.requirements.content || $scope.isUploading) {
        return;
      }
      $scope.isUploading = true;
      var requirementData = {
        requirementText: $scope.requirements.content
      };
      ChallengeService.createRequirement($scope.challenge.id, requirementData).then(function(data) {
        ChallengeService.getRequirement($scope.challenge.id, data.id).then(function(data){
          data.editRequirementText = data.requirementText;
          data.edit = false;
          $scope.requirements.requirementList.push(data);
          $scope.requirements.content = '';
          if ($scope.requirements.requirementList.length > 0) {
            $scope.requirements.complete = true;
          }
          $scope.isUploading = false;
        }, function(response){
          console.log('Fail to get a requirement: %o', response.data);
          $scope.isUploading = false;
        });
      }, function(response){
        console.log('Fail to create the requirement: %o', response.data);
        $scope.isUploading = false;
      });

    };

    /*save or edit requirement*/
    $scope.saveRequirement = function(requirement) {
      if (requirement.edit) {
        ChallengeService.updateRequirement(requirement).then(function() {
          requirement.editRequirementText = requirement.requirementText;
          requirement.edit = !requirement.edit;
        }, function(response){
          requirement.requirementText = requirement.editRequirementText;
          console.log('Fail to update the requirement: %o', response.data);
          requirement.edit = !requirement.edit;
        });
      }else{
        requirement.edit = !requirement.edit;
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
      }, function(response){
        console.log('Fail to delete the requirement: %o', response.data);
      });
    };

  }   // end of RequirementsController

})(window, window.angular);