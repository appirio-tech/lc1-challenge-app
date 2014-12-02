(function (window, angular, undefined) {
  'use strict';

  angular
    .module('tc.aaf')
    .service('Utils', Utils);

  /**
   * @name Utils
   * @desc Utils class for Manage Challenges
   * @param {!angular.$http}
   * @param {!angular.$q}
   * @returns
   * @ngInject
   */
  Utils.$inject = ['$filter', '$http', '$log', '$q', '$window', 'ngTableParams', 'AAF_TABLE'];
  function Utils($filter, $http, $log, $q, $window, ngTableParams, AAF_TABLE) {
    var _challenges;

    var serviceAPI = {
      apiGet: apiGet,
      apiPatch: apiPatch,
      apiPost: apiPost,
      apiUpdate: apiUpdate,
      apiDelete: apiDelete,
      initCase: initCase,
      getBrowser: getBrowser,
      getJsonData: getJsonData,
      handleTable: handleTable
    };

    return serviceAPI;

    /***** Private Functions *****/

    function getBrowser() {
      var userAgent = $window.navigator.userAgent;
      var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};
      for (var key in browsers) {
        if (browsers[key].test(userAgent)) {
          return key;
        }
      }
      return 'unknown';
    }


    //TODO: remove or replace when we refactor to use ng-grid
    //helper function for configuring ng-tables
    function handleTable(controller, $scope, headers, data, totalCount, sorting) {
      var perPage = AAF_TABLE.defaultRowsPerPage;
      var vm = controller;

      vm.columnHeaders = headers;
      vm.tableParams = new ngTableParams(
        {
          page: 1, // show first page
          count: perPage, //fixed page size
          sorting: sorting // initial sorting
        },
        {
          total: totalCount,
          getData: function ($defer, params) {
            // use built-in angular filter
            var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
            $defer.resolve($scope.tableRows = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          }
        });
    }

    function getJsonData(jsonUrl) {
      var deferred = $q.defer();

      $http({method: 'GET', url: jsonUrl})
        .success(function (data, status, headers, config) {
          deferred.resolve(data);
        })
        .error(function (data, status, headers, config) {
          deferred.reject(data);
        });
      return deferred.promise;
    }

    //TODO: refactor http calls
    function apiGet(uri) {
      var deferred = $q.defer();
      $http({method: 'GET', url: uri})
        .success(function (data, status, headers, config) {
          //$log.debug('angular apiGet: data back: ', uri, data);
          deferred.resolve(data);
        })
        .error(function (data, status, headers, config) {
          deferred.reject(data);
        });
      return deferred.promise;
    }

    function apiPost(uri, body) {
      var deferred = $q.defer();
      $http.post(uri, body)
        .success(function (result, status, headers, config) {
          $log.debug('result back from create call: ', result);
          deferred.resolve(result);
        })
        .error(function (data, status, headers, config) {
          deferred.reject(data);
        });
      return deferred.promise;
    }

    function apiUpdate(uri, body) {
      var deferred = $q.defer();
      $http.put(uri, body)
        .success(function (data, status, headers, config) {
          $log.debug('data back from update call: ', data.content);
          deferred.resolve(data.content);
        })
        .error(function (data, status, headers, config) {
          deferred.reject(data);
        });
      return deferred.promise;
    }

    function apiPatch(uri, body) {
      var deferred = $q.defer();
      $http({
        method: 'PATCH',
        url: uri,
        body: body
      })
        .success(function (data, status, headers, config) {
          $log.debug('data back from patch call: ', data.content);
          deferred.resolve(data.content);
        })
        .error(function (data, status, headers, config) {
          deferred.reject(data);
        });
      return deferred.promise;
    }
    function apiDelete(uri, body) {
      var deferred = $q.defer();
      $http.delete(uri, body)
        .success(function (data, status, headers, config) {
          $log.debug('data back from delete call: ', data);
          deferred.resolve(data.content);
        })
        .error(function (data, status, headers, config) {
          deferred.reject(data);
        });
      return deferred.promise;
    }

    function initCase(str) {
      return str.toLowerCase().replace(/(?:^|\s)[a-z]/g, function (m) {
            return m.toUpperCase();
      });
    }

  }

})(window, window.angular);
