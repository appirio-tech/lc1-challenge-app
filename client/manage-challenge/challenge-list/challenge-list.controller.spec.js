describe('Unit: ChallengeListController', function() {
  var ctrl, scope, ConfigService;

  beforeEach(module('manageChallenge'));

  var challenges = [
    {
      "id": 1,
      "name": "Asteroid Data Hunter - System Architecture",
      "account": {
        "id": "a1",
        "name": "IQSS-NTL"
      }
    },
    {
      "id": 2,
      "name": "Google Domain Custom Dashboard Architecture",
      "account": {
        "id": "a2",
        "name": "Acme"
      },
      "lastUpdatedAt": "2014/09/30 3:34 PM",
      "status": "Submission"
    }
  ];

  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(inject(function($controller, $rootScope, _ConfigService_) {

   ConfigService = _ConfigService_;

    // Create the controller
    ctrl = $controller('ChallengeListController as vm', {
      $scope: $rootScope.$new(),
      //challenges come in via resolve
      resolvedChallenges: challenges
    });
  }));

  /** Tests */
  it('all public apis available',
    function() {
      expect(angular.isFunction(ctrl.toTCChallengeDetailsURL)).toBe(true);
      expect(angular.isFunction(ctrl.deleteChallenge)).toBe(true);
  });

  it('loads all challenges',
    function() {
      expect(ctrl.challenges.length).toEqual(challenges.length);
  });

  it('by default user agent is not a phone',
    function() {
      expect(ctrl.phone).toBe(false);
  });

  it('by default browser to be chrome',
    function() {
      expect(ctrl.browser).toBe('chrome');
  });

  it('should provide the correct url to the challenge details page on the tc site',
    function() {
      expect(ctrl.toTCChallengeDetailsURL(challenges[0])).toEqual(ConfigService.getBaseChallengeDetailsUrl() + challenges[0].id);
  });

})