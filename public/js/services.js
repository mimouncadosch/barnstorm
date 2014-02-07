'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var myModule = angular.module('myApp.services', []);
myModule.factory('auth', ['$rootScope', '$http', function($rootScope, $http) {
  function isLoggedin() {
  	$http.get('/api/isLoggedin').success(function(data, status, headers, config) {
  		$rootScope.user = data;
	});
  }
  return isLoggedin();
}]);
