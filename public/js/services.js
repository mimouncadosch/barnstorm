'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var myModule = angular.module('myApp.services', []);
myModule.factory('auth', ['$rootScope', '$http', '$location', function($rootScope, $http, $location) {
  function isLoggedin() {
  	$http.get('/api/isLoggedin').success(function(data, status, headers, config) {
  		$rootScope.user = data;
	}).error(function (data, status, headers, config) {
		if(status == 401) {
			$location.path('/landing');
		}
	});
  }
  return isLoggedin();
}]);
