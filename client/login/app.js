(function(window, angular, undefined) {
  'use strict';

  angular.module('tc.login', [])
  .constant("CONSTANTS", {
    "auth0Host": "https://serenity-tc.auth0.com",
    "auth0ClientId": "g3hdq1pfeuvnuayv96aMMpWKUnCWJjVb"
  })

  .controller('LoginController', LoginController)

  function LoginController($location, CONSTANTS) {
  	var vm = this;
  	vm.auth0Host = CONSTANTS.auth0Host;
  	vm.clientId = CONSTANTS.auth0ClientId;

    var port = '';
    if ($location.port() !== 80) {
      port = ':' + $location.port();
    }

    var baseUrl =  $location.protocol() + '://' + $location.host() + port;
    console.log('$baseurl', baseUrl)
  	vm.redirectUri = baseUrl + '/_auth_/callback';

  	vm.connections = [
			// {
  	// 		name: 'google-oauth2',
  	// 		displayName: 'Google Login'
  	// 	},
			{
  			name: 'github',
  			displayName: 'Github Login'
  		}
			// {
  	// 		name: 'twitter',
  	// 		displayName: 'Twitter Login'
  	// 	},
			// {
  	// 		name: 'facebook',
  	// 		displayName: 'Facebook Login'
  	// 	}
  	];
  }

})(window, window.angular);