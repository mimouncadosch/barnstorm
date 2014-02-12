'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
controller('AppCtrl', function ($scope, $http) {

}).
controller('thankyouCtrl', function ($scope, $http) {

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
controller('dashboardCtrl', function ($rootScope, $scope, $http, $location, auth, GoogleMap, Dates) {
	
	
	$scope.getTweets = function() {
		console.log("calling getTweets in front end");
		$http({
			method: 'GET',
			url: '/api/db'
		}).success(function (data, status, headers, config) {
			console.log('success');
			console.log(data);
			draw(data);
	
		}).error(function (data, status, headers, config) {
			console.log(data);
		});			
	}

	function draw(tweets){
			console.log("Calling draw tweets");

			// console.log(Dates.formatDate(tweets[0].created_at));
	
			var sentimentArray = [];
			for (var i = 0; i < tweets.length; i++) {
				sentimentArray.push(tweets[i].sentiment);
				// console.log("tweets[i].sentiment" + tweets[i].sentiment);
			};

			var datesArray = [];
			for (var i = 0; i < tweets.length; i++) {
				var myDate = Dates.formatDate(tweets[i].created_at);
				datesArray.push(myDate);
				// console.log("tweets[i].sentiment" + tweets[i].sentiment);
			};
			/**
			* Drawing function here
			*/

			var lineChartData = {
				labels : datesArray,
				datasets : [
				{
					fillColor : "rgba(220,220,220,0.5)",
					strokeColor : "rgba(220,220,220,1)",
					pointColor : "rgba(220,220,220,1)",
					pointStrokeColor : "#fff",
					data : sentimentArray
				}
				// ,
				// {
				// 	fillColor : "rgba(151,187,205,0.5)",
				// 	strokeColor : "rgba(151,187,205,1)",
				// 	pointColor : "rgba(151,187,205,1)",
				// 	pointStrokeColor : "#fff",
				// 	data : [28,48,40,19,96,27,100]
				// }
				]

			}
			var myLine = new Chart(document.getElementById("canvas").getContext("2d")).Line(lineChartData);

	}
	
	$scope.getTweets();
	

	

}).
controller('mapCtrl', function ($rootScope, $scope, $http, $location, auth, GoogleMap) {


	//console.log("I'm in Map Controller");
	var map = GoogleMap.createMap();

	$scope.getTweets = function() {
		console.log("calling getTweets in front end");
		$http({
			method: 'GET',
			url: '/api/db'
		}).success(function (data, status, headers, config) {
			console.log('success');
			GoogleMap.fillMap(data, map);
		}).error(function (data, status, headers, config) {
			console.log(data);
		});			
	}




	console.log("reply text");
	$scope.reply = {username: 'freeslugs'};
	//console.log($scope.reply.text);
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
	
		$scope.getTweets();
	


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




// var margin = {top: 30, right: 30, bottom: 30, left: 40},
// 			    width = 700 - margin.left - margin.right,
// 			    height = 450 - margin.top - margin.bottom;


// 			var x = d3.time.scale()
// 			    .range([0, width])

// 			var y = d3.scale.linear()
// 			    .range([height, 0]);

// 			var xAxis = d3.svg.axis()
// 			    .scale(x)
// 			    .orient("bottom");

// 			var yAxis = d3.svg.axis()
// 			    .scale(y)
// 			    .orient("left");

// 			var line = d3.svg.line()
// 			    .x(function(d) { return x(d.date); })
// 			    .y(function(d) { return y(d.close); });

// 			var svg = d3.select("#graph").append("svg")
// 			    .attr("width", width + margin.left + margin.right)
// 			    .attr("height", height + margin.top + margin.bottom)
// 			  	.append("g")
// 			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 			  var data = tweets.map(function(d) {
// 			  	//Fri Feb 07 21:17:24 +0000 2014
// 			  	// "2014-02-08T09:26:37.000Z"
// 			  	// var format = d3.time.format("%a %b %d %H:%M:%S %Z %Y"); // "%a %b %d %H:%M:%S %Z %Y
// 			  	//console.log(format.parse(d.created_at));
// 			  	//console.log(format.parse("Fri Feb 07 21:17:24 +0000 2014"));
// 			      return {
// 			         // date: format.parse(d.created_at),  //
// 			         date : new Date(d.created_at),
// 			         close: d.sentiment
// 			      };
			      
// 			  });

// 			    x.domain(d3.extent(data, function(d) { return d.date; }));
// 			  y.domain(d3.extent(data, function(d) { return d.close; }));

// 			  svg.append("g")
// 			      .attr("class", "x axis")
// 			      .attr("transform", "translate(0," + height + ")")
// 			      .call(xAxis);

// 			  svg.append("g")
// 			      .attr("class", "y axis")
// 			      .call(yAxis)
// 			    .append("text")
// 			      .attr("transform", "rotate(-90)")
// 			      .attr("y", 6)
// 			      .attr("dy", ".71em")
// 			      .style("text-anchor", "end")
// 			      .text("Sentiment");

// 			  svg.append("path")
// 			      .datum(data)
// 			      .attr("class", "line")
// 			      .attr("d", line);
// 			  }
