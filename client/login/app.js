(function(window, angular, undefined) {
  'use strict';

  angular.module('tc.login', ['ngRoute', 'tc.aaf.auth'])
  .controller('LoginController', LoginController)

  function LoginController($location, AUTH0) {
  	var vm = this;
  	vm.auth0Host = AUTH0.host;
  	vm.clientId = AUTH0.clientId;

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