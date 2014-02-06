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
		when('/', {
			templateUrl: 'partials/landing.html',
			controller: 'landingCtrl'
		}).
		when('/landing', {
			templateUrl: 'partials/landing.html',
			controller: 'landingCtrl'
		}).
		when('/dashboard', {
			templateUrl: 'partials/dashboard.html',
			controller: 'dashboardCtrl'
		}).
		when('/profile', {
			templateUrl: 'partials/profile.html',
			controller: 'profileCtrl'
		});//.
		//otherwise({redirectTo:'/landing'});

	$locationProvider.html5Mode(true);
});