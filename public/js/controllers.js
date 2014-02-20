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
controller('dashboardCtrl', function ($rootScope, $compile, $scope, $http, $location, auth, GoogleMap, Dates) {
	
	
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
			var length = tweets.length;

			for (var i = 0; i < length; i++) {
				sentimentArray.push(tweets[i].sentiment);
				// console.log("tweets[i].sentiment" + tweets[i].sentiment);
			};

			var datesArray = [];
			for (var i = 0; i < length; i++) {
				var myDate = Dates.formatDate(tweets[i].created_at);
				datesArray.push(myDate);
				// console.log("tweets[i].sentiment" + tweets[i].sentiment);
			};

			var tweetsArray = [];
			for (var i = 0; i < length; i++) {
				tweetsArray.push(tweets[i].text);
			};
		
			var usersArray = [];
			for (var i = 0; i < length; i++) {
				usersArray.push(tweets[i].user.screen_name);
			};

			/**
			* Drawing function here
			*/

			var defaults = {

				//Boolean - If we show the scale above the chart data			
				scaleOverlay : false,
				
				//Boolean - If we want to override with a hard coded scale
				scaleOverride : false,
				
				//** Required if scaleOverride is true **
				//Number - The number of steps in a hard coded scale
				scaleSteps : null,
				//Number - The value jump in the hard coded scale
				scaleStepWidth : null,
				//Number - The scale starting value
				scaleStartValue : null,

				//String - Colour of the scale line	
				scaleLineColor : "rgba(0,0,0,.1)",
				
				//Number - Pixel width of the scale line	
				scaleLineWidth : 1,

				//Boolean - Whether to show labels on the scale	
				scaleShowLabels : true,
				
				//Interpolated JS string - can access value
				scaleLabel : "<%=value%>",
				
				//String - Scale label font declaration for the scale label
				scaleFontFamily : "'Arial'",
				
				//Number - Scale label font size in pixels	
				scaleFontSize : 12,
				
				//String - Scale label font weight style	
				scaleFontStyle : "normal",
				
				//String - Scale label font colour	
				scaleFontColor : "#666",	
				
				///Boolean - Whether grid lines are shown across the chart
				scaleShowGridLines : true,
				
				//String - Colour of the grid lines
				scaleGridLineColor : "rgba(0,0,0,.05)",
				
				//Number - Width of the grid lines
				scaleGridLineWidth : 1,	
				
				//Boolean - Whether the line is curved between points
				bezierCurve : true,
				
				//Boolean - Whether to show a dot for each point
				pointDot : true,
				
				//Number - Radius of each point dot in pixels
				pointDotRadius : 3,
				
				//Number - Pixel width of point dot stroke
				pointDotStrokeWidth : 1,
				
				//Boolean - Whether to show a stroke for datasets
				datasetStroke : true,
				
				//Number - Pixel width of dataset stroke
				datasetStrokeWidth : 2,
				
				//Boolean - Whether to fill the dataset with a colour
				datasetFill : true,
				
				//Boolean - Whether to animate the chart
				animation : true,

				//Number - Number of animation steps
				animationSteps : 60,
				
				//String - Animation easing effect
				animationEasing : "easeOutQuart",

				//Function - Fires when the animation is complete
				onAnimationComplete : null
				
			}

			var lineChartData = {
				labels : datesArray,
				datasets : [
				{
					fillColor : "rgba(220,220,220,0.5)",
					strokeColor : "rgba(220,220,220,1)",
					pointColor : "rgba(220,220,220,1)",
					pointStrokeColor : "#FFFFFF",
					data : sentimentArray,
					mouseover: function(data) {
			        // data returns details about the point hovered, such as x and y position and index, as
			        // well as details about the hover event in data.event
			        // You can do whatever you like here, but here is a sample implementation of a tooltip
			        var active_sentiment = sentimentArray[data.point.dataPointIndex];
			        var active_date = datesArray[data.point.dataPointIndex];
			        var active_tweet = tweetsArray[data.point.dataPointIndex];
			        var active_user = usersArray[data.point.dataPointIndex];

			        var content = '<div>' + 
			        '<p>“' + active_tweet + '”</p>' +
			        '<p><strong> Sentiment </strong>: ' + active_sentiment + '</p>' + 
			        '<p>' + active_date + '</p>' + 
			        '<p><strong> User: </strong>' + active_user + '</p>' + 
			        '<input ng-model="reply.text" type="text"></input>'
			        '<button ng-click="replyTweet($index)">reply</button>' + 
			        '</div>';
			    	var compiled = $compile(content)($scope);
			    	console.log(compiled[0]);
			        $('#tooltip').html(compiled[0]).css("position", "absolute").css("left", data.point.x-17).css("top", data.point.y-55).css("display", 'block');
			    },
			    mouseout: function (data) {
				    // Hide the tooltip
				    $('#tooltip').html("").css("display", "none");
				}
			}]
		};

		var ctx = document.getElementById("canvas").getContext("2d");
		var chart = new Chart(ctx).Line(lineChartData, defaults);
		// var myLine = new Chart(document.getElementById("canvas").getContext("2d")).Line(lineChartData, defaults);

	}
	
	$scope.getTweets();

	$scope.reply = {};

	
	$scope.replyTweet = function(text) {
		console.log("replying to tweets");
		console.log(text);
		$scope.reply.username = username;
		$scope.reply.text = text;
		$http({
			method: 'POST',
			url: '/reply',
			params: {
				username: user, 
				text: text
			}
		}).success(function (data, status, headers, config) {
			console.log(data);
		}).error(function (data, status, headers, config) {
			console.log(data);
		});		

	}

	

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
			GoogleMap.fillMap($scope, data, map);
			console.log('tweets in map ctrl');
			console.log(data)
		}).error(function (data, status, headers, config) {
			console.log(data);
		});			
	}





	$scope.reply = {username: 'freeslugs'};
	//console.log($scope.reply.text);
	$scope.reply.text = 'I like your policies';

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
