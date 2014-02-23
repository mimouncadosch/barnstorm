'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
controller('AppCtrl', function ($scope, $http) {

}).
controller('thankyouCtrl', function ($scope, $http) {

}).
controller('landingCtrl', function ($scope, $http) {
	$('body').addClass('bg-img');
}).
controller('dashboardCtrl', function ($rootScope, $compile, $scope, $http, $location, auth, GoogleMap, Dates) {
	$scope.getTweets = function() {
		console.log("calling getTweets in front end");
		$http({
			method: 'GET',
			url: '/api/db'
		}).success(function (data, status, headers, config) {
			if(data.length < 3) {
				alert('Welcome to Barnstorm! Our servers now work for you, and are gathering all tweets about you. Please visit Barnstorm frequently to track your social media ');
			}
			$scope.tweets = data;
			//console.log(data);
			draw();
		}).error(function (data, status, headers, config) {
			// console.log(data);
		});			
	}
	/**
	* Drawing function here
	*/
	function draw(){
		// console.log('I am drawing');
		// console.log($scope.tweets);
		var sentimentArray = [], datesArray = [];
		for (var i = 0; i < $scope.tweets.length; i++) {
			var myDate = Dates.formatDate($scope.tweets[i].created_at);
			sentimentArray.push($scope.tweets[i].sentiment);
			datesArray.push(myDate);
		};

		// console.log("sentiment Array");
		// console.log(sentimentArray);

		// console.log("datesArray");
		// console.log(datesArray);


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
			scaleLineColor : "rgba(0,0,0,.25)",
			
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
			scaleFontColor : "#fff",	
			
			///Boolean - Whether grid lines are shown across the chart
			scaleShowGridLines : true,
			
			//String - Colour of the grid lines
			scaleGridLineColor : "rgba(0,0,0,.1)",
			
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
			datasets : [{
				fillColor : "rgba(255,255,255,0.5)",
				strokeColor : "rgba(220,220,220,1)",
				pointColor : "rgba(220,220,220,1)",
				pointStrokeColor : "#fff",
				data : sentimentArray,
				mouseover: function(data) {
					var index = data.point.dataPointIndex;
	
					var content = '<div>' + 
					'<p>“' + $scope.tweets[index].text + '”</p>' +
					'<p>Sentiment: ' + $scope.tweets[index].sentiment + '</p>' + 
					'<p>' + datesArray[index] + '</p>' + 
					'<form class="form" ng-submit="replyTweet(text,'+index+')">' + 
						'<input class="" ng-model="text"></input>' +
						'<button class="btn btn-default btn-sm">tweet</button>' + 
					'</form>' +
					'</div>';
					var compiled = $compile(content)($scope);
					
					$('#tooltip').html(compiled[0])
						.css("position", "absolute")
						.css("left", data.point.x-$('#tooltip').width()/2)
						.css("top", data.point.y-$('#tooltip').height()-20)
						.css("display", 'block');
				},
				mouseout: function (data) {
				    // Hide the tooltip
				    $('#tooltip').html("").css("display", "none");
				}
			}]
		};

		// get selector by context
		var ctx = $('#canvas').get(0).getContext("2d");
		// pointing parent container to make chart js inherit its width
		var container = $('#canvas').parent();

		// make chart width fit with its container
		var ww = $('#canvas').attr('width', $(container).width() );
		var ww = $('#canvas').attr('height', 400 );
		// Initiate new chart or Redraw
		new Chart(ctx).Line(lineChartData, defaults);
	

	}
	
	$scope.getTweets();

	$scope.reply = {};

	$scope.replyTweet = function(text, index) {
		console.log(text);
		console.log(index);

		$scope.reply.screen_name = $scope.tweets[index].user.screen_name;
		$scope.reply.text = text;

		console.log($scope.reply.screen_name);
		console.log($scope.reply.text);

		$http({
			method: 'POST',
			url: '/reply',
			params: $scope.reply
		}).success(function (data, status, headers, config) {
			window.alert("Success! Your response to " + $scope.reply.screen_name + " was sent");
			console.log(data);
		}).error(function (data, status, headers, config) {
			console.log(data);
		});		

	}
}).
controller('mapCtrl', function ($rootScope, $scope, $http, $location, auth, GoogleMap) {
	var map = GoogleMap.createMap();

	$scope.getTweets = function() {
		console.log("calling getTweets in front end");
		$http({
			method: 'GET',
			url: '/api/db'
		}).success(function (data, status, headers, config) {
			console.log('success');
			$scope.tweets = data;
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

	$scope.replyTweet = function(text, index) {
		console.log(text);
		console.log(index);

		$scope.reply.screen_name = $scope.tweets[index].user.screen_name;
		$scope.reply.text = text;

		console.log($scope.reply.screen_name);
		console.log($scope.reply.text);

		$http({
			method: 'POST',
			url: '/reply',
			params: $scope.reply
		}).success(function (data, status, headers, config) {
			window.alert("Success! Your response to " + $scope.reply.screen_name + " was sent");
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
