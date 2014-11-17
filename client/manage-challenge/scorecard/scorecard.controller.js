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
      vm.errorMsg = '';

      console.log("1: ", vm.scorecard);

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
          var scorecardItemScore = scorecardItem.score || 0;
          sum = sum + scorecardItemScore;
        });

        vm.scorecard.scoreSum = sum;
        vm.scorecard.scorePercent = (sum / vm.scorecard.scoreMax) * 100;
        console.log('check score1', vm.scorecard);
      }

      function saveAndNav() {
        console.log('saveAndNav')
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
        console.log('vm.challenge', vm.challenge, scorecardBody)
        ChallengeService.updateScorecard(vm.challenge.id, scorecardBody).then(function(updateChallengeResult) {
          console.log('after updated scorecard', updateChallengeResult, vm.scorecardItems)
          ChallengeService.updateScorecardItems(vm.challenge.id, vm.scorecardItems).then(function(res) {
            console.log('after updating scorecard. now resolve', res)
            deferred.resolve();
          });

        })
        return deferred.promise;
      }

      function allItemsScored() {
        console.log('vm.scorecardItems', vm.scorecardItems)
        var scorecardItems = vm.scorecard.scorecardItems.content
        var allScored = true;
        _.forEach(scorecardItems, function(scorecardItem) {
          console.log('score', scorecardItem.requirementId, scorecardItem.score);
          allScored = allScored && (scorecardItem.score >= 0)
          console.log('allScored', allScored);
        });
        return allScored;

      }

      function submitScorecard() {
        console.log('in submitScorecard', vm.scorecard)

        var allScored = allItemsScored(vm.scorecard.scorecardItems.content);
        console.log('allScored', allScored)

        if (!allScored) {
          vm.errorMsg = 'Not all scored';
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

    }

})(window, window.angular);
