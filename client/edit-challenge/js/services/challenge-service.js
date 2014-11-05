/**
 * This code is copyright (c) 2014 Topcoder Corporation
 */

(function (window, angular, undefined) {
  'use strict';


	angular
	  .module('edit.challenge')
    .service('ChallengeService', ChallengeService);

  ChallengeService.$inject = ['$timeout', 'Restangular'];

  function ChallengeService($timeout, Restangular) {
    var Challenges = Restangular.service('challenges');
    var Tags = Restangular.service('tags');
    var Accounts = Restangular.service('accounts');
    
    var service = {
      getChallenge: getChallenge,
      createChallenge: createChallenge,
      updateChallenge: updateChallenge,
      deleteChallenge: deleteChallenge,
      launch: launchChallenge,

      getRequirements: getRequirements,
      getRequirement: getRequirement,
      createRequirement: createRequirement,
      updateRequirement: updateRequirement,
      deleteRequirement: deleteRequirement,

      getFiles: getFiles,
      getFile: getFile,
      uploadChallengeFile: uploadChallengeFile,
      deleteFile: deleteFile,

      getAllTags: getAllTags,
      getAccounts: getAccounts
      
    };
    return service;

    /*--------------------*/
    /* challenges APIs */
    /*--------------------*/

    /*get all challenges*/
    function getChallenges() {
      return Challenges.getList();
    }

    /*create new challenge*/
    function createChallenge(data) {
      return Challenges.post(data);
    }

    /*get a challenge*/
    function getChallenge(challengeId) {
      return Challenges.one(challengeId).get();
    }

    /*update a challenge*/
    function updateChallenge(challenge) {
      return challenge.put();
    }

    /*delete a challenge*/
    function deleteChallenge(challenge) {
      return challenge.remove();
    }

    /*launch the challenge*/
    function launchChallenge(challenge) {
      return Restangular.one('challenges', challenge.id).customPOST(challenge, 'launch', {}, {'Content-type':'application/json'});
    }

    /*----------------------*/
    /* requirements APIs */
    /*----------------------*/

    /*get all requirements in the challenge*/
    function getRequirements(challengeId) {
      return Restangular.one('challenges', challengeId).all('requirements').getList();
    }
    /*get a single requirement in the challenge*/
    function getRequirement(challengeId, requirementId) {
      return Restangular.one('challenges', challengeId).one('requirements', requirementId).get();
    }

    /*add new requirement to the challenge*/
    function createRequirement(challengeId, data) {
      return Restangular.one('challenges', challengeId).all('requirements').post(data);
    }

    /*update a requirement on the challenge*/
    function updateRequirement(requirement) {
      return requirement.put();
    }

    /*delete a requirement on the challenge*/
    function deleteRequirement(requirement) {
      return requirement.remove();
    }

    /*---------------*/
    /* files APIs */
    /*---------------*/

    /*get all files in the challenge*/
    function getFiles(challengeId) {
      return Restangular.one('challenges', challengeId).all('files').getList();
    }

    /*get a single file in the challenge*/
    function getFile(challengeId, fileId) {
      return Restangular.one('challenges', challengeId).one('files', fileId).get();
    }

    /*upload a file to the challenge*/
    function uploadChallengeFile(challengeId, fileData) {
      var fd = new FormData();
      fd.append("title", fileData.title);
      fd.append("file", fileData.file);
      var promise = Restangular.one('challenges', challengeId).withHttpConfig({transformRequest: angular.identity})
        .customPOST(fd, 'files', {}, {'Content-type':undefined});
      return promise;
    }

    /*delete a file*/
    function deleteFile(file) {
      return file.remove();
    }

    /*--------------*/
    /* misc APIs */
    /*--------------*/

    /*retrieve all tags to be attached to a challenge*/
    function getAllTags() {
      return Tags.getList();
    }

    /*find a account by query string to be attached to a challenge*/
    function getAccounts(query) {
      // query is field=value
      return Accounts.getList({filter: query});
    }

  };


})(window, window.angular);