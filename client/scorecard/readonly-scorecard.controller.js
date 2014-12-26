(function (window, angular, undefined) {
  'use strict';

  angular.module('manageChallenge')
    .controller('ReadonlyScorecardController', ReadonlyScorecardController);

    //TODO(DG: 10/30/2014): Update jsdoc
    /**
     * @name ScorecardController
     * @ngInject
     */
    function ReadonlyScorecardController($location, $q, $rootScope, $scope, matchmedia, ChallengeService, Utils, TC_SCORING, ConfigService, resolvedScorecard, resolvedCurrentChallenge) {
      var vm = this;
      vm.scorecardItems = resolvedScorecard.content.scorecardItems.content;
      vm.scorecard = resolvedScorecard.content;
      vm.challenge = resolvedCurrentChallenge;
      vm.tcChallengeDetailsUrl = tcChallengeDetailsUrl;
      vm.tcMemberProfileUrl = tcMemberProfileUrl;

      // view page of scorecard total score and total score out of
      vm.totalScore = totalScore(resolvedScorecard.content);
      vm.outOfScore = outOfScore(resolvedScorecard.content);

      //user-agent stuff
      vm.browser = Utils.getBrowser();
      vm.phone = matchmedia.isPhone();

      //sort items by requirement id desc
      vm.scorecardItems = _.sortBy(vm.scorecardItems, function(scoreItem) {
        return scoreItem.requirement.id;
      });

      activate();

      function activate() {
        //table stuff
        var sort = {sequence: 'asc'};
        var headers = [
          {
            "colName": "No.",
            "col": "sequence"
          },
          {
            "colName": "Requirement",
            "col": "requirement"
          },
          {
            "colName": "Score",
            "col": "score"
          }/*,
          {
            "colName": "Comment",
            "col": "comment"
          }*/
        ];


        Utils.handleTable(vm, $scope, headers, vm.scorecardItems, vm.totalCount, sort);
      }

      //helper functions
      $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
        console.log("failed to change routes", event);
        console.log("failed to change routes", current);
        console.log("failed to change routes", previous);
        console.log("failed to change routes", rejection);
      });

      function tcChallengeDetailsUrl(challenge) {
        return ConfigService.getBaseChallengeDetailsUrl() + challenge.id + '/?type=develop&lc=true';
      }

      function scoreItems() {
        var scorecardItems = vm.scorecard.scorecardItems.content;
        var sum = 0;

        _.forEach(scorecardItems, function(scorecardItem) {
          var score = 0;
          if (scorecardItem.score && scorecardItem.score > 0) {
            score = scorecardItem.score;
          }
          sum = sum + score;
        });

        vm.scorecard.scoreSum = sum;
        vm.scorecard.scorePercent = (sum / vm.scorecard.scoreMax) * 100;
      }

      // 8.  At the bottom of your page put a sum of the score out of the possible points,
      // you may assume that each scorecard item is a maximum of 4 points.
      // So for this challenge the scorecard the max score is 6 x 4 = 24 points
      function totalScore(scorecard) {
        var sum = 0;
        for (var i = scorecard.scorecardItems.content.length - 1; i >= 0; i--) {
          // condtion to only sum the scores that have been scored, -1 equates not summed
          if ( scorecard.scorecardItems.content[i].score >= 0 ) {
            sum+=scorecard.scorecardItems.content[i].score
          }
        };
        return sum;
      }

      function outOfScore(scorecard) {
        return scorecard.scorecardItems.content.length*4;// assumed that score is on 4
      }

      function tcMemberProfileUrl(memberHandle) {
        return ConfigService.getBaseMemberProfileUrl() + memberHandle;
      }

    }

})(window, window.angular);
