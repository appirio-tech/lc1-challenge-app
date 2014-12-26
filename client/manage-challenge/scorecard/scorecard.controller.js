(function (window, angular, undefined) {
  'use strict';

  angular.module('manageChallenge')
    .controller('ScorecardController', ScorecardController);

    //TODO(DG: 10/30/2014): Update jsdoc
    /**
     * @name ScorecardController
     * @ngInject
     */
    function ScorecardController($location, $q, $scope, matchmedia, ChallengeService, Utils, TC_SCORING, ConfigService, resolvedScorecard, resolvedCurrentChallenge) {

      var vm = this;
      vm.scorecardItems = resolvedScorecard.content.scorecardItems.content;
      vm.totalCount = resolvedScorecard.content.scorecardItems.metadata.totalCount;
      vm.scorecard = resolvedScorecard.content;
      vm.challenge = resolvedCurrentChallenge;
      vm.tcChallengeDetailsUrl = tcChallengeDetailsUrl;
      vm.saveAndNav = saveAndNav;
      vm.submitScorecard = submitScorecard;
      vm.alerts = [];
      vm.closeAlert = closeAlert;
      vm.tcMemberProfileUrl = tcMemberProfileUrl;

      // vm.scorecard.scorecardItems.content[2].comment = ""; // check for no comments situation

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

    $scope.setActive = function (event){
		  angular.element(event.target).siblings().removeClass("active-btn");
		  angular.element(event.target).addClass('active-btn');
		  angular.element(event.target).attr('active');
	  }

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

      function saveAndNav() {
        saveScorecard().then(function() {
          $location.path('/challenges/' + vm.challenge.id + '/submissions/');
        })
      }

      function saveScorecard() {
        var deferred = $q.defer();

        //always re-calc items
        scoreItems();

        //First time save - if status is NEW, change to SAVED
        if (vm.scorecard.status === 'NEW') {
          vm.scorecard.status = 'SAVED';
        }

        var scorecardBody = {
          id: vm.scorecard.id,
          reviewerId: vm.scorecard.reviewerId, //TODO(DG: 11/17/2014): Remove; currently req'd by API
          submissionId: vm.scorecard.submissionId, //TODO(DG: 11/17/2014): Remove; currently req'd by API
          status: vm.scorecard.status,
          scoreSum: vm.scorecard.scoreSum,
          scorePercent: vm.scorecard.scorePercent
        }

        //save scorecard
        ChallengeService.updateScorecard(vm.challenge.id, scorecardBody).then(function(updateChallengeResult) {
          ChallengeService.updateScorecardItems(vm.challenge.id, vm.scorecardItems).then(function(res) {
            deferred.resolve();
          });

        })
        return deferred.promise;
      }

      function allItemsScored() {
        var scorecardItems = vm.scorecard.scorecardItems.content
        var allScored = true;
        _.forEach(scorecardItems, function(scorecardItem) {
          allScored = allScored && (scorecardItem.score >= 0)
        });
        return allScored;

      }

      function submitScorecard() {
        var allScored = allItemsScored(vm.scorecard.scorecardItems.content);

        if (!allScored) {
          vm.alerts[0] = { type: 'warning', msg: "Scorecard can't be submitted until all requirements have been scored." };
        }
        else {
          scoreItems();
          saveScorecard().then(function() {
            vm.scorecard.status = 'SUBMITTED';
            var scorecardBody = {
              id: vm.scorecard.id,
              reviewerId: vm.scorecard.reviewerId,
              submissionId: vm.scorecard.submissionId,
              status: vm.scorecard.status,
              scoreSum: vm.scorecard.scoreSum,
              scorePercent: vm.scorecard.scorePercent,
            }
            ChallengeService.updateScorecard(vm.challenge.id, scorecardBody).then(function(res) {
              $location.path('/challenges/' + vm.challenge.id + '/submissions/');
            });

          });
        }
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

      // control to hide/show the comment column
      $scope.needToShowComment = function(item){
        return item.comment != "";
      }

      function closeAlert(index) {
        vm.alerts.splice(index, 1);
      }

      function tcMemberProfileUrl(memberHandle) {
        return ConfigService.getBaseMemberProfileUrl() + memberHandle;
      }

    }

})(window, window.angular);
