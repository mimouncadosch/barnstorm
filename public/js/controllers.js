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
controller('dashboardCtrl', function ($rootScope, $scope, $http, $location, auth, GoogleMap) {
	
	$scope.getTweets = function() {
		console.log("calling getTweets in front end");
		$http({
			method: 'GET',
			url: '/api/db'
		}).success(function (data, status, headers, config) {
			draw(data);
		}).error(function (data, status, headers, config) {
			console.log(data);
			// $scope.getTweets();
		});			
	}
	console.log("reply text");
	console.log($scope.reply.text);
	// $scope.reply = {username: 'freeslugs'};
	//$scope.reply.text = 'I like your policies';

	$scope.replyTweet = function() {
		console.log("replying to tweets");
		$http({
			method: 'POST',
			url: '/reply',
			params: $scope.reply
		}).success(function (data, status, headers, config) {
			console.log(data);
		}).error(function (data, status, headers, config) {
			console.log(data);
		});		

	}

		function draw(tweets){
			console.log(tweets);
			var margin = {top: 20, right: 20, bottom: 30, left: 50},
			    width = 960 - margin.left - margin.right,
			    height = 500 - margin.top - margin.bottom;


			var x = d3.time.scale()
			    .range([0, width])

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

			var svg = d3.select("#graph").append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  	.append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			  var data = tweets.map(function(d) {
			  	//Fri Feb 07 21:17:24 +0000 2014
			  	// "2014-02-08T09:26:37.000Z"
			  	// var format = d3.time.format("%a %b %d %H:%M:%S %Z %Y"); // "%a %b %d %H:%M:%S %Z %Y
			  	//console.log(format.parse(d.created_at));
			  	//console.log(format.parse("Fri Feb 07 21:17:24 +0000 2014"));
			      return {
			         // date: format.parse(d.created_at),  //
			         date : new Date(d.created_at),
			         close: d.sentiment
			      };
			      
			  });

			  console.log(data);


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
			  }


		// console.log("I'm in Map Controller");
		// var map = GoogleMap.createMap();

		// $scope.getTweets = function() {
		// 	console.log("calling getTweets in front end");
		// 	$http({
		// 		method: 'GET',
		// 		url: '/api/db'
		// 			// params: {
		// 			// 	username : $scope.user.twitter.username
		// 			// }
		// 		}).success(function (data, status, headers, config) {
		// 			console.log("Tweet Location: ");
		// 			console.log(data);
		// 			GoogleMap.populateMap(data, map);

		// 			//console.log($scope.tweets);
		// 		}).error(function (data, status, headers, config) {
		// 			console.log("error");
		// 			// console.log(data);
		// 		});			
		// 	}


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

// controller('mapCtrl', function ($rootScope, $scope, $http, $location, auth, GoogleMap) {
// 	console.log("I'm in Map Controller");
// 	var map = GoogleMap.createMap();

// 	$scope.$watch('user', function(newValue) {
// 		if($scope.user) {
// 			console.log('watch change');
// 			console.log($scope.user.twitter.username);

// 			$scope.getTweets = function() {
// 				console.log("calling getTweets in front end");
// 				$http({
// 					method: 'GET',
// 					url: '/api/db'
// 						// params: {
// 						// 	username : $scope.user.twitter.username
// 						// }
// 					}).success(function (data, status, headers, config) {
// 						console.log("Tweet Location: ");
// 						console.log(data);
// 						GoogleMap.populateMap(data, map);

// 						//console.log($scope.tweets);
// 					}).error(function (data, status, headers, config) {
// 						console.log("error");
// 						// console.log(data);
// 					});			
// 				}
// 				$scope.getTweets();
// 			}
// 		});



// });




