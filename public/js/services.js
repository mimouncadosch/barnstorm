'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var myModule = angular.module('myApp.services', []);
myModule.factory('auth', ['$rootScope', '$http', '$location', function($rootScope, $http, $location) {
  function isLoggedin() {
  	$http.get('/api/isLoggedin').success(function(data, status, headers, config) {
  		$rootScope.user = data;
	}).error(function (data, status, headers, config) {
		if(status == 401) {
			$location.path('/landing');
		}
	});
  }
  return isLoggedin();
}]);

myModule.factory('GoogleMap', function($http){
	return {
		createMap: function () {	
			console.log("I'm calling GoogleMap in services");
			var myOptions = {
                zoom : 12,
                center : new google.maps.LatLng(40.750046, -73.992358),
                mapTypeId : google.maps.MapTypeId.ROADMAP
            };
            
            var map = new google.maps.Map(document.getElementById('map-canvas'),
                myOptions);

            return map;
		},
		populateMap: function(tweets, map){

			console.log(tweets);
			var locations = [];
			
			for (var i = 0; i < tweets.length; i++) {

				var myLatLng = new google.maps.LatLng(tweets[i].user.coordinates.lat, tweets[i].user.coordinates.lng);
				var marker = new google.maps.Marker({
                        position: myLatLng,
                        map: map,
                });

                var contentString =  
                  '<div id="infoWindow">'+
                  '<p>'+ tweets[i].text + '</p>'+
                  '<p>'+ tweets[i].user.screen_name + '</p>'+
                  '<p>'+ tweets[i].user.followers_count + '</p>'+
                  '<p> <strong> Sentiment </strong>' + tweets[i].sentiment + '</p>'+
                  // '<h2>' + locations[i].user.followers_count + '</h2>'+
                   '</div>';

               var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });
                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.open(map,marker);
                });

			};
		}

	}
});
