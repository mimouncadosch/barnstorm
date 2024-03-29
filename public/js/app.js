'use strict';

// Declare app level module which depends on filters, and services

var myApp = angular.module('myApp', [
	'ngRoute',
	'myApp.controllers',
	'myApp.filters',
	'myApp.services',
	'myApp.directives'
]);
myApp.config(function ($routeProvider, $locationProvider) {
	$routeProvider.
		when('/', {
			redirectTo:'/landing'
		}).
		when('/landing', {
			templateUrl: 'partials/landing.html',
			controller: 'landingCtrl'
		}).
		when('/dashboard', {
			templateUrl: 'partials/dashboard.html',
			controller: 'dashboardCtrl'
		}).
		when('/map', {
			templateUrl: 'partials/map.html',
			controller: 'mapCtrl'
		}).
		when('/profile', {
			templateUrl: 'partials/profile.html',
			controller: 'profileCtrl'
		}).
		when('/features', {
			templateUrl: 'partials/features.html',
			controller: 'landingCtrl'
		}).
		when('/contact', {
			templateUrl: 'partials/contact.html',
			controller: 'landingCtrl'
		}).
		when('/thankyou', {
			templateUrl: 'partials/thankyou.html',
			controller: 'thankyouCtrl'
		}).
		otherwise({redirectTo:'/landing'});

	$locationProvider.html5Mode(true);
});

