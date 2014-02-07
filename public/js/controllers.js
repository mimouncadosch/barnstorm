'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
	controller('AppCtrl', function ($scope, $http) {

		

	}).
	controller('landingCtrl', function ($scope, $http) {
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
	controller('dashboardCtrl', function ($scope, $http, auth) {
	// write Ctrl here
		$scope.getTweets = function() {
			console.log("calling getTweets in front end");
			$http({
				method: 'GET',
				url: '/api/cronJob?username=freeslugs',
			}).success(function (data, status, headers, config) {
				draw(data);
				// console.log(data);
				//console.log($scope.tweets);
			}).error(function (data, status, headers, config) {
				console.log(data);
			});			
		}

		function draw(data){
		
			console.log("program is calling to draw the map");
			console.log("Date from DB");
			console.log(data);
			
			// var parsedDates = [];
			// for (var i = 0; i < data.length; i++) {

			// 	var db_date = data[i].created_at;
			// 	console.log("db_date: ");
			// 	console.log(db_date);

			// 	var JS_date = new Date(db_date);
			// 	console.log("JS_date");
			// 	console.log(JS_date);
				
			// 	parsedDates.push(JS_date);
			// }
			

			var margin = {top: 20, right: 20, bottom: 30, left: 50},
			    width = 960 - margin.left - margin.right,
			    height = 500 - margin.top - margin.bottom;

			var parseDate = d3.time.format("%d-%b-%y").parse;

			var x = d3.time.scale()
			    .range([0, width]);

			var y = d3.scale.linear()
			    .range([height, 0]);

			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom");

			var yAxis = d3.svg.axis()
			    .scale(y)
			    .orient("left");

			var line = d3.svg.line()
			    .x(function(d) { return x(d.date); })
			    .y(function(d) { return y(d.close); });

			var svg = d3.select("body").append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


			d3.json('/api/cronJob?	username=freeslugs', function(error, data) {
				console.log("HERE IS DATA IN D3");
				console.log(data);
			  data.forEach(function(d) {
			    d.created_at = parseDate(d.created_at);
			    d.sentiment = d.sentiment;
			  });

			  x.domain(d3.extent(data, function(d) { return d.date; }));
			  y.domain(d3.extent(data, function(d) { return d.close; }));

			  svg.append("g")
			      .attr("class", "x axis")
			      .attr("transform", "translate(0," + height + ")")
			      .call(xAxis);

			  svg.append("g")
			      .attr("class", "y axis")
			      .call(yAxis)
			    .append("text")
			      .attr("transform", "rotate(-90)")
			      .attr("y", 6)
			      .attr("dy", ".71em")
			      .style("text-anchor", "end")
			      .text("Sentiment");

			  svg.append("path")
			      .datum(data)
			      .attr("class", "line")
			      .attr("d", line);
			});
		}

	}).

	controller('profileCtrl', function ($scope, $http, $location, auth) {
		$scope.$watch('user', function(newValue) {
			if($scope.user) {
				console.log('watch change');
				console.log($scope.user);
			}
		});

		$scope.logout = function() {
			$http.get('/api/logout');
		}
	});