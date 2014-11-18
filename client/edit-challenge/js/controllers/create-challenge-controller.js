/**
 * This code is copyright (c) 2014 Topcoder Corporation
 */

(function (window, angular, undefined) {
  'use strict';

	angular
	  .module('edit.challenge')
	  .controller('CreateChallengeController', CreateChallengeController);

	CreateChallengeController.$inject = ['$scope', '$timeout', '$filter', '$state', 'ChallengeService', 'challenge'];

	function CreateChallengeController($scope, $timeout, $filter, $state, ChallengeService, challenge) {

    $scope.challenge = challenge;
    $scope.editDescription = true;
    $scope.publicBrowsing = {
      complete: false
    }

    /*save new challenge*/
    if ($scope.challenge && !$scope.challenge.id) {
      ChallengeService.createChallenge($scope.challenge).then(function(data) {
        $state.go('edit-challenge', {challengeId: data.id});
      });
    }

    /*watch challenge object*/
    $scope.$watch('challenge', function(newVal) {
      if (newVal.title && newVal.title.trim() && newVal.overview && newVal.overview.trim() && newVal.description && newVal.description.trim()) {
        $scope.publicBrowsing.complete = true;
      } else {
        $scope.publicBrowsing.complete = false;
      }
    }, true);

    /*save current challenge and related info*/
    $scope.saveChallenge = function() {
      //reset the flag that shows the growl notification
      $scope.showSuccessGrowl = false;
      if ($scope.timeLine.complete) {
        $scope.challenge.regStartAt = concatenateDateTime($scope.timeLine.stdt, $scope.timeLine.timeSelectedStart);
        $scope.challenge.subEndAt = concatenateDateTime($scope.timeLine.enddt, $scope.timeLine.timeSelectedEnd);
      };

      if ($scope.prizes.customerAccountName) {
        $scope.challenge.account = $scope.prizes.customerAccountName;
      };
      if ($scope.prizes.customerAccountId) {
        $scope.challenge.accountId = ''+$scope.prizes.customerAccountId;
      };
      // grap prizes
      var prizes = [];
      _.each($scope.placePrizes.places, function(place) {
        if (place.active && place.prize > 0) {
          prizes.push(Number(place.prize));
        }
      });
      $scope.challenge.prizes = prizes;

      // update challenge info
      ChallengeService.updateChallenge($scope.challenge).then(function(actionResponse) {
        //after a successful save show the growl
        $scope.showSuccessGrowl = true;

        console.log('updated challenge: ', actionResponse.id);
      }, function(errorResponse) {
        console.log('update challenge: error: ', errorResponse);
      });

    };

    /*get accounts based on the query string*/
    $scope.accounts = [];
    function getAccounts(query) {
      // query is field=value
      ChallengeService.getAccounts(query).then(function(data) {
        $scope.accounts = data;
      });
    };

    /*get all tags and initialize the tags input and initialize the tags input*/
    $scope.tags = $scope.challenge.tags;
    var tagNames = null;
    function getAllTags() {
      ChallengeService.getAllTags().then(function(data) {
        tagNames = new Bloodhound({
          datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          local: data
        });
        tagNames.initialize();
        $('input.tags-input').tagsinput({
          typeaheadjs: {
            name: 'tagNames',
            displayKey: 'name',
            valueKey: 'name',
            source: tagNames.ttAdapter()
          },
          freeInput: false,
        });
        $scope.$watch('tags', function(){
          $scope.challenge.tags=$("input.tags-input").tagsinput('items');
        });
      });
    };
    getAllTags();

    /*launch a challenge*/
    $scope.launch = function() {
      ChallengeService.launch($scope.challenge).then(function(actionResponse) {
        console.log('launched challenge: ', $scope.challenge.id);
        window.location.href = '/manage/#/challenges?launchSuccess='+$scope.challenge.id;
      });
    }

    /*------------------------*/
    /*  file browsing section */
    /*------------------------*/
    $scope.fileBrowsing = {
      uploadedFiles: [],
      complete: false
    };

    /*---------------------*/
    /* requirement section */
    /*---------------------*/
    $scope.requirements = {
      content: '',
      requirementList: [],
      complete: false
    };

    /*-----------*/
    /* Time line */
    /*-----------*/
    $scope.timeLine = {
      minDate: new Date(),
      startOpened: false,
      endOpened: false,
      isopen: false,
      isopenStart: false,
      complete: false
    };

    var startNew = false;
	var dtTenSet;
    var dtMinDate = Date.now();
    var dtTenDayCounts = 240 * 60 * 60 * 1000;
	var regStartAt;
	var subEndAt;

    if ($scope.challenge.regStartAt) {
      regStartAt = new Date($scope.challenge.regStartAt);
	} else {
      regStartAt = new Date(dtMinDate);
      $scope.challenge.regStartAt = regStartAt.toISOString();

      dtTenSet = new Date(dtMinDate + dtTenDayCounts);
      $scope.challenge.subEndAt = dtTenSet.toISOString();
	}
    $scope.timeLine.stdt = regStartAt;
    $scope.timeLine.timeSelectedStart = $filter('date')(regStartAt, 'HH:mm:ss');

    if ($scope.challenge.subEndAt) {
      subEndAt = new Date($scope.challenge.subEndAt);
    } else {
      subEndAt = new Date(dtMinDate + dtTenDayCounts);
      $scope.challenge.subEndAt = subEndAt.toISOString();
    }
    $scope.timeLine.enddt = subEndAt;
    $scope.timeLine.timeSelectedEnd = $filter('date')(subEndAt, 'HH:mm:ss');

    /*open start calendar*/
    $scope.openStartCal = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.timeLine.startOpened = true;
      $scope.timeLine.endOpened = false;
    };

    /*end start calendar*/
    $scope.openEndCal = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.timeLine.endOpened = true;
      $scope.timeLine.startOpened = false;
    };

    /*calendar date format*/
    $scope.format = 'MM/dd/yyyy';
    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    /*times*/
    $scope.times = _.times(24, function(n) {
      if (n <10) {
        return {'time': '0'+n+':00:00'};
      } else {
        return {'time': n+':00:00'};
      }
    });

    /*set start time*/
    $scope.setStartTime = function(time) {
      $scope.timeLine.timeSelectedStart = time.time;
      calculateDuration();
    };
    /*set end time*/
    $scope.setEndTime = function(time) {
      $scope.timeLine.timeSelectedEnd = time.time;
      calculateDuration();
    };

    function updateTimeLine(type) {
      if ($scope.timeLine.stdt > $scope.timeLine.enddt) {
        if (type === 'stdt') {
          $scope.timeLine.stdt = angular.copy($scope.timeLine.enddt);
        } else {
          $scope.timeLine.enddt = angular.copy($scope.timeLine.stdt);
        }
      }
      calculateDuration();
      if ($scope.timeLine.stdt && $scope.timeLine.enddt && $scope.timeLine.dateDiff > 0) {
        $scope.timeLine.complete = true;
      } else {
        $scope.timeLine.complete = false;
      }
    };

    /*set end date*/
    $scope.$watch('timeLine.stdt', function() {
      updateTimeLine('stdt');
    });

    /*watch end date*/
    $scope.$watch('timeLine.enddt', function() {
      updateTimeLine('enddt');
    });

    /*concatenate date and time*/
    function concatenateDateTime(date, hour) {
      // hour: hh:mm;ss
      var dateTime = angular.copy(date);
      if (hour) {
        var hms = hour.split(':');
        dateTime.setHours(hms[0], hms[1], hms[2], 0);
      }
      return dateTime;
    }

    /*get difference date*/
    function calculateDuration() {
      // use moment.js
      var start = moment(concatenateDateTime($scope.timeLine.stdt, $scope.timeLine.timeSelectedStart));
      var end = moment(concatenateDateTime($scope.timeLine.enddt, $scope.timeLine.timeSelectedEnd));
      $scope.timeLine.dateDiff = end.diff(start, 'days');
    }


    /*---------------*/
    /* Prize section */
    /*---------------*/
    $scope.prizes = {
      totalPrize: 0,
      customerAccountName: '',
      customerAccountId: '',
      activeCount: 2,
      complete: false
    };
    // default prize values
    $scope.placePrizes = {
      places: [
        {
          active: true,
          prize: '1200'
        }, {
          active: true,
          prize: '600'
        }, {
          active: false,
          prize: null
        }, {
          active: false,
          prize: null
        }, {
          active: false,
          prize: null
        }
      ]
    };

    function populatePrizes() {
      var prizes = $scope.challenge.prizes;
      if (!_.isEmpty(prizes)) {
        for (var i=0; i<prizes.length; i+=1) {
          if (prizes[i]) {
            $scope.placePrizes.places[i] = {active: true, prize: prizes[i]};
          }
        }
        if (prizes.length < 5) {
          for (var i=prizes.length; i<5; i+=1) {
            $scope.placePrizes.places[i] = {active: false, prize: null};
          }
        }
      };
    }

    // get prizes in the challenge
    if ($scope.challenge.id) {
      populatePrizes();
    }

    /*set Place prize*/
    $scope.setPlacePrize = function(place, index) {
      // only last one can be activated
      if (index !== 0 && !$scope.placePrizes.places[index - 1].active) {
        return false;
      }
      place.active = true;
      place.prize = '';
    };

    /*remove Place prize*/
    $scope.removePlacePrize = function(place, index) {
      place.active = false;
      place.prize = null;
    };

    /*reorder prizes in descending order*/
    function prizeReorder() {
      $scope.placePrizes.places.sort(function(a, b) {
        if (a.active && !b.active) {
          return -1;
        } else if (!a.active && b.active) {
          return 1;
        } else {
          return Number(b.prize) - Number(a.prize);
        }
      });
    }

    /* check prizes and set complete if prize and customer are set*/
    $scope.checkPrizeComplete = function() {
      $scope.prizes.complete = (!!($scope.prizes.totalPrize > 0 && $scope.placePrizes.places[0].prize > 0) && $scope.prizes.customerAccountId);
    };

    /*update prizes when input text loses a focus*/
    $scope.updatePrizes = function() {
      // reorder prize
      prizeReorder();

      $scope.prizes.totalPrize = 0;
      $scope.prizes.activeCount = 0;
      // calculate the total prize
      angular.forEach($scope.placePrizes.places, function(value, key) {
        if (value.active) {
          $scope.prizes.activeCount += 1;
        }
        if (value.prize) {
          $scope.prizes.totalPrize += parseInt(value.prize);
        }
      });
      $scope.checkPrizeComplete();
    };
    $scope.updatePrizes();

    $scope.$watch('prizes.customerAccountId', function() {
      $scope.checkPrizeComplete();
    }, true);

    /*customer account auto complete*/
    $scope.autoComplete = {
      options: {
        html: true,
        focusOpen: false,
        onlySelect: true,
        appendTo: '.customer-account-holder',
        position: {my: "left top", at: "left bottom", collision: "none"},

        source: function (request, response) {
          // customerAccountsList
          var promise = ChallengeService.getAccounts();
          promise.then(function(data) {
            response($.map(data, function(value) {
              if (value.name.toLowerCase().indexOf($scope.prizes.customerAccountName.toLowerCase()) > -1) {
                return {
                  label: value.name,
                  customerAccountId: value.id
                };
              }
            }));
          }, function(err) {
          });
        },
        select: function(event, ui) {
          console.log('item: ', ui.item);
          $scope.checkPrizeComplete();
          // values are in ui.item
          $scope.prizes.customerAccountId = ui.item.customerAccountId;
          $scope.prizes.customerAccountName = ui.item.label;
        }
      }
    };

	}  // end of CreateChallengeController

})(window, window.angular);
