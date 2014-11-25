(function (window, angular, undefined) {
  'use strict';

  angular.module('tc.aaf.auth', ['ngCookies'])
  .constant("AUTH0", {
    "host": "https://topcoder.auth0.com",
    "clientId": "c4PVvC1z50DOlOLjLqHb5iw2fGM8teTW"
  })
  .constant("TC_URLS", {
    "baseUrl": "http://tcdev22.topcoder.com/"
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
  function LoginHandler($location, $log, $window) {
    //TODO(DG: 10/30/2014): fix handling of next
    var next = '/';
    var qs = $location.search();
    $log.debug('qs', qs)
    if (qs) {
      //TODO(DG: 10/30/2014): JWT validation
      var jwt = qs.jwt;

      //store token on client
      $window.sessionStorage.token = jwt;

      //clear tokens from qs
      $location.search('jwt', null);
      $location.search('state', null);
      $location.path('/').replace();
    }
  }

  /**
   * @ngInject
   */
  function AuthInterceptor($cookies, $location, $log, $q, $window, TC_URLS) {
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
          var redirectUrl;
          var currentBaseUrl =  $location.protocol() + '://' + $location.host() + port;
          //console.log('host, baseUrl', $location.host(), currentBaseUrl);
          if ($location.host().indexOf('topcoder') >= 0) {
            redirectUrl = TC_URLS.baseUrl + '?action=showlogin?next=' + currentBaseUrl;
          }
          else {
            redirectUrl = currentBaseUrl + '/login';
          }
          $window.location.href =  redirectUrl
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
  function UserService($q, $window, Utils, TC_URLS) {
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