(function (window, angular, undefined) {
  'use strict';

  angular.module('manageChallenge')
    .controller('SubmissionsController', SubmissionsController);

    //TODO(DG: 10/30/2014): Update jsdoc
    /**
     * @name SubmissionsController
     * @ngInject
     */
    function SubmissionsController($filter, $location, $q, $scope, matchmedia, ChallengeService, Utils, TC_URLS, submissionData, resolvedCurrentChallenge) {
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
      vm.total = 0;

      var orderedSubs = _.sortBy(vm.submissions, function(sub) {
        if (sub.scorecard) {
          return -1 * sub.scorecard.scorePercent;
        } else {
          return 0;
        }

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
          if (sub) {
            payout.pay = true;
            payout.reviewerId = sub.reviewerId,
            payout.submissionId = sub.id;
            payout.scorePercent = sub.scorePercent;
            payout.id = sub.id;
          }
        }
        vm.payouts.push(payout);
        vm.total = vm.total + prize;
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
          // {
          //   "colName": "Reviewer",
          //   "col": "scorecard.reviewerId" //reviewer
          // },
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
        if (vm.challenge.status !== 'REVIEW') {
          vm.alerts.push({ type: 'warning', msg: "Challenge needs to be in Review status before winners can be declared." });
        }
        else if (!allScorecardsSubmitted()) {
          vm.alerts.push({ type: 'warning', msg: "Challenge winners can't be declared until all scorecards have been submitted." });
        } else {
          //TODO(DG: 11/17/2014): implement dialog; for now show in a in-page table
          vm.showWinnersTable = true;
        }
      }

      function confirmWinners() {
        /*
        1. Update all scorecards
        2. update challenge status
        3. Nav to results
        */

        var today = $filter('date')(Date.now(), 'yyyy-MM-ddTHH:mmZ', 'UTC'); //, timezone

        var deferred = $q.defer();
        var scorecardPromises = [];
        _.forEach(vm.payouts, function(payout) {
          if (payout.id) {
            var promise = ChallengeService.updateScorecard(vm.challenge.id, payout);
            scorecardPromises.push(promise);
          } else {
            console.log('no payout for ', payout)
          }
        });

        $q.all(scorecardPromises).then(function(res) {
          vm.challenge.status = 'COMPLETE';
          var body = {
            id: vm.challenge.id,
            title: vm.challenge.title,
            status: vm.challenge.status,
            completedAt: today
          }
          ChallengeService.updateChallenge(body).then(function(challenge) {
            deferred.resolve(challenge);
            $location.path('/challenges/' + vm.challenge.id + '/results');
          });
        })


        return deferred.promise;

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