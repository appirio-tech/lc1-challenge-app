(function (window, angular, undefined) {
  'use strict';

  angular.module('tc.aaf.auth')
  .factory('mockAuthInterceptor', MockAuthInterceptor)
  .constant("MOCK_USER", {
    "uid": 123,
    "handle": "topcoder123",
    "name": "Top Coder",
    "picture": "https://www.topcoder.com/wp-content/themes/tcs-responsive/i/default-photo.png"
  })
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('mockAuthInterceptor');
  });

  /**
   * @ngInject
   */
  function MockAuthInterceptor($cookies, $location, $log, $q, $window, MOCK_USER) {
    return {
      request: function (config) {
        config.headers = config.headers || {};
        config.headers['X-uid'] = MOCK_USER.uid;
        config.headers['X-handle'] = MOCK_USER.handle;
        config.headers['X-name'] = MOCK_USER.name;
        config.headers['X-picture'] = MOCK_USER.picture;
        return config;
      }
    };
  }

})(window, window.angular);