(function (window, angular, undefined) {
  'use strict';

  var module = angular.module('manageChallenge')
    .controller('ResultsController', ResultsController);

  //TODO(DG: 10/20/2014): Update jsdoc
  /**
   * @name ResultsController
   * @ngInject
   */
  function ResultsController($scope, matchmedia, ChallengeService, Utils, ConfigService, resolvedChallengeResults, resolvedCurrentChallenge) {
    var vm = this;
    vm.results = resolvedChallengeResults.content;
    vm.totalCount = resolvedChallengeResults.metadata.totalCount;
    vm.challenge = resolvedCurrentChallenge;
    vm.tcChallengeDetailsUrl = tcChallengeDetailsUrl;
    vm.tcMemberProfileUrl = tcMemberProfileUrl;
    vm.download = download;

    //user-agent stuff
    vm.browser = Utils.getBrowser();
    vm.phone = matchmedia.isPhone();

    activate();

    function activate() {
      //TODO(DG: 10/15/2014): replace w/ ng-grid
      //table stuff
      var headers = [
        {
          "colName": "Place",
          "col": "scorecard.place"
        },
        {
          "colName": "Prize",
          "col": "scorecard.prize"
        },
        {
          "colName": "Submitter",
          "col": "submitterId"
        },
        {
          "colName": "Score",
          "col": "scorecard.scoreSum"
        }
      ];

      var sort = {'scorecard.place': 'asc'};
      Utils.handleTable(vm, $scope, headers, vm.results, vm.totalCount, sort);
    }

    //helper functions
    function tcChallengeDetailsUrl(challenge) {
      return ConfigService.getBaseChallengeDetailsUrl() + challenge.id + '?type=develop&lc=true';
    }

    function tcMemberProfileUrl(memberHandle) {
      return ConfigService.getBaseMemberProfileUrl() + memberHandle;
    }

    function download(fileDownloadUrl) {
      ChallengeService.getSignedUrl(fileDownloadUrl).then(function(url) {
        window.location = url;
      })
    }

  }

})(window, window.angular);