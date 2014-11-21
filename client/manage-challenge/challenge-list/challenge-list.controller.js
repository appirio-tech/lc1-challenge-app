(function (window, angular, undefined) {
  'use strict';

  angular.module('manageChallenge')
    .controller('ChallengeListController', ChallengeListController);

  //TODO(DG: 10/20/2014): Update jsdoc
  /**
   * @name ChallengeListController
   * @desc
   * @returns
   * @ngInject
   */
  function ChallengeListController($scope, matchmedia, ChallengeService, Utils, TC_URLS, resolvedChallenges, $location) {
    var locationParams = $location.search();
    $scope.launchedChallenge = locationParams['launchSuccess']
    $scope.challengeUrl = $scope.launchedChallenge + '?type=develop&lc=true';
    $scope.TC_URLS = TC_URLS;

    var vm = this;
    vm.challenges = resolvedChallenges.content;
    vm.totalCount = resolvedChallenges.metadata.totalCount;
    vm.toTCChallengeDetailsUrl = toTCChallengeDetailsUrl;
    vm.toTCProjectUrl = toTCProjectUrl;
    vm.deleteChallenge = deleteChallenge;
    vm.alerts = [];
    vm.closeAlert = closeAlert;

    //user-agent stuff
    vm.browser = Utils.getBrowser();
    vm.phone = matchmedia.isPhone();

    activate();

    function activate() {

      //TODO(DG: 10/15/2014): replace w/ ng-grid
      //table stuff
      var headers = [
        {
          "colName": "Id",
          "col": "id"
        },
        {
          "colName": "Name",
          "col": "title"
        },
        {
          "colName": "Project Id",
          "col": "projectId"
        },
        {
          "colName": "Last Updated",
          "col": "updatedAt"
        },
        {
          "colName": "Status",
          "col": "status"
        }
      ];

      var sort = {updatedAt: 'desc'};
      Utils.handleTable(vm, $scope, headers, vm.challenges, vm.totalCount, sort);
    }

    //helper functions
    function toTCChallengeDetailsUrl(challenge) {
      return TC_URLS.baseChallengeDetailsUrl + challenge.id + '?type=develop&lc=true';
    }

    function toTCProjectUrl(challenge) {
      return TC_URLS.directProjectUrl + '?formData.projectId=' + challenge.projectId;
    }

    function deleteChallenge(challenge) {
      _.remove(vm.challenges, { 'id': challenge.id });
      ChallengeService.deleteChallenge(challenge.id).then(function(res) {
        vm.alerts.push({ type: 'warning', msg: "Challenge has been deleted." });
        vm.totalCount = vm.totalCount - 1;
        vm.tableParams.reload();
      });

    }

    function closeAlert(index) {
      vm.alerts.splice(index, 1);
    }

  }


})(window, window.angular);
