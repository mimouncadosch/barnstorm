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
				url: '/dict'
			}).success(function (data, status, headers, config) {
				$scope.tweets = data;
				draw(data);
				console.log($scope.tweets);
			}).error(function (data, status, headers, config) {
				console.log(data);
			});			
		}

		function draw (data){
		
			console.log("program is calling to draw the map");
			console.log("Date from DB");
			
			var parsedDates = [];
			for (var i = 0; i < data.length; i++) {

				var db_date = data[i].created_at;
				console.log("db_date: ");
				console.log(db_date);

				var JS_date = new Date(db_date);
				console.log("JS_date");
				console.log(JS_date);
				
				parsedDates.push(JS_date);
				
			};

			console.log("length: ");
			console.log(parsedDates.length);

			console.log("parsedDates");

			console.log(parsedDates[3]);
			console.log(parsedDates[4]);


			// create a simple data array that we'll plot with a line (this array represents only the Y values, X will just be the index location)
			// var data = [3, 6, 2, 7, 5, 2, 0, 3, 8, 9, 12, 5, 9, 3, 6, 3, 6, 2, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7];


			// write Ctrl here
			var m = [80, 200, 80, 200]; // margins
			var w = 1000 - m[1] - m[3]; // width
			var h = 400 - m[0] - m[2]; // height

		// X scale will fit all values from data[] within pixels 0-w
		// var x = d3.scale.linear().domain([0, data.length]).range([0, w]);
		var x = d3.time.scale()
		.domain([new Date(parsedDates[0]), d3.time.day.offset(new Date(parsedDates[parsedDates.length - 1]), 1)])
		// .rangeRound([0, w - m.left - m.right]);

		// Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
		var y = d3.scale.linear().domain([0, 20]).range([h, 0]);
			// automatically determining max range can work something like this
			// var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

		// create a line function that can convert data[] into x and y points
		var line = d3.svg.line()
			// assign the X function to plot our line as we wish
			.x(function(d,i) { 
				// verbose logging to show what's actually being done
				console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
				// return the X coordinate where we want to plot this datapoint
				return x(i); 
			})
			.y(function(d) { 
				// verbose logging to show what's actually being done
				console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
				// return the Y coordinate where we want to plot this datapoint
				return y(d); 
			})

			// Add an SVG element with the desired dimensions and margin.
			var graph = d3.select("#graph").append("svg:svg")
			.attr("width", w + m[1] + m[3])
			.attr("height", h + m[0] + m[2])
			.append("svg:g")
			.attr("transform", "translate(" + m[3] + "," + m[0] + ")");

			// create yAxis
			var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
			// Add the x-axis.
			graph.append("svg:g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + h + ")")
			.call(xAxis);


			// create left yAxis
			var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
			// Add the y-axis to the left
			graph.append("svg:g")
			.attr("class", "y axis")
			.attr("transform", "translate(-25,0)")
			.call(yAxisLeft);
			
  			// Add the line by appending an svg:path element with the data line we created above
			// do this AFTER the axes above so that the line is above the tick-lines
			graph.append("svg:path").attr("d", line(data.created_at));


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