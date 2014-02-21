'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
controller('AppCtrl', function ($scope, $http) {

}).
controller('thankyouCtrl', function ($scope, $http) {

}).
controller('landingCtrl', function ($scope, $http) {

}).
controller('dashboardCtrl', function ($rootScope, $compile, $scope, $http, $location, auth, GoogleMap, Dates) {
	$scope.getTweets = function() {
		console.log("calling getTweets in front end");
		$http({
			method: 'GET',
			url: '/api/db'
		}).success(function (data, status, headers, config) {
			$scope.tweets = data;
			draw();
		}).error(function (data, status, headers, config) {
			console.log(data);
		});			
	}
	/**
	* Drawing function here
	*/
	function draw(){
		var sentimentArray = [], datesArray = [];
		for (var i = 0; i < $scope.tweets.length; i++) {
			var myDate = Dates.formatDate($scope.tweets[i].created_at);
			sentimentArray.push($scope.tweets[i].sentiment);
			datesArray.push(myDate);
		};

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
				fillColor : "rgba(220,220,220,0.5)",
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
					'<button class="btn btn-default btn-sm" ng-click="replyTweet('+index+')">reply</button>' + 
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

		// enable resizing matter
		//$(window).resize( generateChart );

		function generateChart(){
			// make chart width fit with its container
			var ww = $('#canvas').attr('width', $(container).width() );
			var ww = $('#canvas').attr('height', 400 );
			// Initiate new chart or Redraw
			new Chart(ctx).Line(lineChartData, defaults);
		};

		generateChart();

	}
	
	$scope.getTweets();

	$scope.reply = {};

	$scope.replyTweet = function(index) {
		console.log("replying to tweets");
		console.log(index);
		
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
