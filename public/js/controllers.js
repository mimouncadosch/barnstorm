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

		function draw(tweets){
		
			console.log("program is calling to draw the map");
			console.log("Date from DB");
			console.log(tweets);
			
			/* implementation heavily influenced by http://bl.ocks.org/1166403 */
			var data = [];
			var dates = [];
			for (var i = 0; i < tweets.length; i++) {
				data.push(tweets[i].sentiment);
				dates.push(new Date(tweets[i].created_at));
				console.log(new Date(tweets[i].created_at));
				//var format = d3.time.format("%Y-%m-%dT%H:%M:%SZ");
				//alert(format.parse("2011-07-01T19:15:28Z"));
			};

			// define dimensions of graph
			var m = [80, 80, 80, 80]; // margins
			var w = 1000 - m[1] - m[3]; // width
			var h = 400 - m[0] - m[2]; // height

			// X scale will fit all values from data[] within pixels 0-w
			//var x = d3.scale.linear().domain([0, data.length]).range([0, w]);
			var x = d3.time.scale()
		    	.domain([dates[0].created_at, d3.time.day.offset(dates[data.length - 1].created_at, 1)])
			    .rangeRound([0, w - m.left - m.right]);

			// Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
			var y = d3.scale.linear().domain([0, 10]).range([h, 0]);

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
  			graph.append("svg:path").attr("d", line(data));

		};
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