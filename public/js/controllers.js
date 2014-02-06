'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
	controller('AppCtrl', function ($scope, $http) {

		

	}).
	controller('MyCtrl1', function ($scope, $http) {
		// $scope.twitter = function(){
		// 	$http({
		// 		method: 'GET',
		// 		url: '/auth/twitter'
		// 	}).success(function (data, status, headers, config) {
		// 		$location.path('/auth/twitter');
		// 	}).error(function (data, status, headers, config) {
		// 		$scope.name = 'Error!'
		// 	});
		// }


	}).
	controller('MyCtrl2', function ($scope, $http) {
	// write Ctrl here
		$scope.getTweets = function() {
			$http({
				method: 'GET',
				url: '/api/gettweets'
			}).success(function (data, status, headers, config) {
				$scope.tweets = data;
				console.log($scope.tweets);
			}).error(function (data, status, headers, config) {
				console.log(data);
			});			
		}

	}).
	controller('MyCtrl3', function ($scope, $http) {
	// write Ctrl here
		
	});