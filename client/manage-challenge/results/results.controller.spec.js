// Tests here

describe('Controller: ResultsController', function() {
  var scope, challengeService, $location;
  
  beforeEach(function() {
    var mockChallengeService = {};
    module('app', function($provide) {
      $provide.value('challengeService', mockChallengeService);
    });
    
    inject(function($q) {
      mockChallengeService.challengeData = [
        {
          id: 1,
          name: 'Challenge 1'
        },
        {
          id: 2,
          name: 'Challenge 2'
        },
        {
          id: 3,
          name: 'Challenge 3'
        },
        {
          id: 4,
          name: 'Challenge 4'
        }
      ];
      
      mockChallengeService.getAll = function() {
        var defer = $q.defer();
        defer.resolve(this.challengeData);
        return defer.promise;
      };
      
      mockChallengeService.create = function(name) {
        var defer = $q.defer();
        
        var id = this.data.length;
        
        var item = {
          id: id,
          name: name
        };
        
        this.data.push(item);
        defer.resolve(item);
        
        return defer.promise;
      };
    });
  });
  
  beforeEach(inject(function($controller, $rootScope, _$location, _challengeService) {
    scope = $rootScope.$new();
    $location = _$location;
    challengeService = _challengeService;
    
    $controller('ListLibrariesCtrl', {$scope: scope, $location: $location, challengeService: challengeService });
    
    scope.$digest();
  }));
  

  
  it('should do what it is supposed to do', function() {
    //TODO(DG: 10/21/2014): Implement
    expect(true);
  });
});