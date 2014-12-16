(function(window, angular, undefined) {
  'use strict';

  angular.module('tc.login', ['ngRoute', 'ngTable', 'tc.aaf', 'tc.aaf.auth'])
  .controller('LoginController', LoginController)

  function LoginController($location, ConfigService) {
  	var vm = this;

    ConfigService.activate().then(function() {
      vm.auth0Host = 'https://' + ConfigService.getAuth0Domain();
      vm.clientId = ConfigService.getAuth0ClientId();
    })

    var port = '';
    if ($location.port() !== 80) {
      port = ':' + $location.port();
    }

    var baseUrl =  $location.protocol() + '://' + $location.host() + port;
  	vm.redirectUri = baseUrl + '/_auth_/callback';

  	vm.connections = [
			{
  			name: 'google-oauth2',
  			displayName: 'Google Login'
  		},
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