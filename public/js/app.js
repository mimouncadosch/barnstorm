'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
	'ngRoute',
	'myApp.controllers',
	'myApp.filters',
	'myApp.services',
	'myApp.directives'
]).
config(function ($routeProvider, $locationProvider) {
	$routeProvider.
		when('/view1', {
			templateUrl: 'partials/partial1.html',
			controller: 'MyCtrl1'
		}).
		when('/view2', {
			templateUrl: 'partials/partial2.html',
			controller: 'MyCtrl2'
		}).
		when('/view3', {
			templateUrl: 'partials/partial3.html',
			controller: 'MyCtrl3'
		});

	$locationProvider.html5Mode(true);
});