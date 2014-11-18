(function (window, angular, undefined) {
  'use strict';

  angular.module('manageChallenge')
    .controller('ScorecardController', ScorecardController);

    //TODO(DG: 10/30/2014): Update jsdoc
    /**
     * @name ScorecardController
     * @ngInject
     */
    function ScorecardController($location, $q, $scope, matchmedia, ChallengeService, Utils, TC_SCORING, TC_URLS, resolvedScorecard, resolvedCurrentChallenge) {

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
          },
          {
            "colName": "Comment",
            "col": "comment"
          }
        ];


        Utils.handleTable(vm, $scope, headers, vm.scorecardItems, vm.totalCount, sort);
      }

      //helper functions
      function tcChallengeDetailsUrl(challenge) {
        return TC_URLS.baseChallengeDetailsUrl + challenge.id;
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
          vm.alerts.push({ type: 'warning', msg: "Scorecard can't be submitted until all requirements have been scored." });
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

      function closeAlert(index) {
        vm.alerts.splice(index, 1);
      }

    }

})(window, window.angular);
