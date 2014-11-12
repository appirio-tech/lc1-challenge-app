(function (window, angular, undefined) {
  'use strict';

  angular.module('manageChallenge')
    .controller('ScorecardController', ScorecardController);

    //TODO(DG: 10/30/2014): Update jsdoc
    /**
     * @name ScorecardController
     * @ngInject
     */
    function ScorecardController($location, $scope, matchmedia, ChallengeService, Utils, TC_URLS, resolvedScorecard, resolvedCurrentChallenge) {
      var vm = this;
      vm.scoreItems = resolvedScorecard.content.scorecardItems.content;
      vm.totalCount = resolvedScorecard.content.scorecardItems.metadata.totalCount;
      vm.scorecard = resolvedScorecard.content;
      vm.challenge = resolvedCurrentChallenge;
      vm.tcChallengeDetailsUrl = tcChallengeDetailsUrl;
      vm.saveScorecard = saveScorecard;

      //user-agent stuff
      vm.browser = Utils.getBrowser();
      vm.phone = matchmedia.isPhone();

      activate();

      function activate() {


        //table stuff
        var sort = {sequence: 'asc'};
        var headers = [
          {
            "colName": "Id",
            "col": "sequence"
          },
          {
            "colName": "Requirement",
            "col": "requirement"
          },
          {
            "colName": "Score",
            "col": "score"
          },
          {
            "colName": "Comment",
            "col": "comment"
          }
        ];


        Utils.handleTable(vm, $scope, headers, vm.scoreItems, vm.totalCount, sort);
      }

      //helper functions
      function tcChallengeDetailsUrl(challenge) {
        return TC_URLS.baseChallengeDetailsUrl + challenge.id;
      }

      function saveScorecard(challenge) {
        ChallengeService.updateScorecardItems(challenge.id, vm.scoreItems).then(function() {
          $location.path('/challenges/' + vm.challenge.id + '/submissions/');
        });
      }

    }


})(window, window.angular);
