(function (window, angular, undefined) {
  'use strict';

  angular.module('manageChallenge')
    .controller('SubmissionsController', SubmissionsController);

    //TODO(DG: 10/30/2014): Update jsdoc
    /**
     * @name SubmissionsController
     * @ngInject
     */
    function SubmissionsController($scope, matchmedia, ChallengeService, Utils, TC_URLS, submissionData, resolvedCurrentChallenge) {
      var vm = this;
      vm.submissions = submissionData.content;
      vm.totalCount = submissionData.metadata.totalCount;
      vm.challenge = resolvedCurrentChallenge;
      vm.tcChallengeDetailsUrl = tcChallengeDetailsUrl;
      vm.initiateAnnounceWinners = initiateAnnounceWinners;
      vm.showWinnersTable = false;
      vm.confirmWinners = confirmWinners;
      vm.cancelWinners = cancelWinners;
      vm.alerts = [];
      vm.closeAlert = closeAlert;

      //user-agent stuff
      vm.browser = Utils.getBrowser();
      vm.phone = matchmedia.isPhone();
      vm.payouts = [];

      var orderedSubs = _.sortBy(vm.submissions, function(sub) {
        return -1 * sub.scorecard.scorePercent;
      });

      _.forEach(vm.challenge.prizes, function(prize, index) {
        var place = index + 1;
        var payout = {
          place: place,
          pay: false,
          prize: prize
        };

        if (index < orderedSubs.length) {
          var sub = orderedSubs[index].scorecard;
          payout.pay = true;
          payout.submissionId = sub.id;
          payout.scorePercent = sub.scorePercent;
        }
        vm.payouts.push(payout);
      });

      activate();

      function activate() {

        //table stuff
        var sort = {id: 'asc'}; //sequence
        var headers = [
          {
            "colName": "Id",
            "col": "id" //TODO(DG: 11/3/2014): want to use 'sequence' instead
          },
          {
            "colName": "Date Submitted",
            "col": "updatedAt" //submittedAt
          },
          {
            "colName": "Reviewer",
            "col": "scorecard.reviewerId" //reviewer
          },
          {
            "colName": "Score",
            "col": "scorecard.scorePercent" //score
          },
          {
            "colName": "Status",
            "col": "status"
          }
        ];


        Utils.handleTable(vm, $scope, headers, vm.submissions, vm.totalCount, sort);

      }

      //helper functions
      function tcChallengeDetailsUrl(challenge) {
        return TC_URLS.baseChallengeDetailsUrl + challenge.id;
      }

      function initiateAnnounceWinners() {
        //validate that all scorecards have SUBMITTED status
        //if not valid, show error
        if (allScorecardsSubmitted()) {
          //TODO(DG: 11/17/2014): implement dialog; for now show in a in-page table
          vm.showWinnersTable = true;
        } else {
          vm.alerts.push({ type: 'warning', msg: "Challenge winners can't be declared until all submissions have been scored." });
        }
      }

      function confirmWinners() {
        console.log('TODO: Implement confirmed winners. Update statuses and nav to results', vm.challenge, vm.sumbissions, vm.payouts);
      }

      function cancelWinners() {
        vm.showWinnersTable = false;
      }

      function allScorecardsSubmitted() {
        var submissions = vm.submissions
        var allSubmitted = true;
        _.forEach(submissions, function(submission) {
          allSubmitted = allSubmitted && (submission.scorecard.status === 'SUBMITTED')
        });
        return allSubmitted;
      }

      function closeAlert(index) {
        vm.alerts.splice(index, 1);
      }

    }


})(window, window.angular);