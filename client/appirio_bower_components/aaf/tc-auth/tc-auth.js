(function (window, angular, undefined) {
  'use strict';

  angular.module('tc.aaf.auth', ['ngCookies'])
  .constant("MOCK", {
    user: {
      "uid": 123,
      "handle": "topcoder123",
      "name": "Top Coder",
      "picture": "https://www.topcoder.com/wp-content/themes/tcs-responsive/i/default-photo.png"
    }
  })

  .factory('authInterceptor', AuthInterceptor)
  .service('UserService', UserService)
  .config(function ($httpProvider, $routeProvider) {
    $httpProvider.interceptors.push('authInterceptor');

    $routeProvider
      .when('/_auth_/login', {
        //Note: a value for template is req'd; cannot remove template attr
        template: '',
        controller: LoginHandler
      })
      .when('/_auth_/logout', {
        template: '',
        controller: LogoutHandler
      })
  });

  /**
   * @ngInject
   */
  function LoginHandler($cookies, $location, $log, $window) {
    //TODO(DG: 10/30/2014): fix handling of next
    var next = '/';
    var qs = $location.search();
    if (qs) {
      //TODO(DG: 10/30/2014): JWT validation
      var jwt = qs.jwt;

      //store token on client
      $window.sessionStorage.token = jwt;
      $cookies.tcjwt = jwt;

      //clear tokens from qs
      $location.search('jwt', null);
      $location.search('state', null);
      $location.path('/').replace();
    }
  }

  /**
   * @ngInject
   */
  function AuthInterceptor($cookies, $location, $log, $q, $rootScope, $window, MOCK) {
    return {
      //Add Auth Header
      request: function (config) {
        config.headers = config.headers || {};
        //attempt to grab auth token in this order
        //1. browser session storage
        //2. topcoder cookie (tcjwt)
        var token = $window.sessionStorage.token || $cookies.tcjwt;
        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        } else {
          config.headers['X-uid'] = MOCK.user.uid;
          config.headers['X-handle'] = MOCK.user.handle;
          config.headers['X-name'] = MOCK.user.name;
          config.headers['X-picture'] = MOCK.user.picture;
        }

        return config;
      },
      responseError: function (rejection) {
        //console.log('have an auth error; redirect to login', rejection)
        if (rejection.status >= 400) {
          var port = '';
          if ($location.port() !== 80) {
            port = ':' + $location.port();
          }

          $log.error('tc-auth: auth failed', rejection);
          $rootScope.$broadcast('Unauthorized', rejection);
        }
        return $q.reject(rejection);
      }
    };
  }

  /**
   * @ngInject
   */
  function LogoutHandler($window) {
    delete $window.sessionStorage.token;
  }

  /**
   * @ngInject
   */
  function UserService($q, $window, Utils) {
    var currentUser;

    return {
      getCurrentUser: function() {
        var deferred = $q.defer();

        if (currentUser) {
          deferred.resolve(currentUser);
        } else {
          Utils.apiGet('/_api_/user').then(function(user) {
            currentUser = user;
            deferred.resolve(currentUser);
          });
        }

        return deferred.promise;
      }
    }
  }


})(window, window.angular);