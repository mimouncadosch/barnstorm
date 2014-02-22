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

myModule.factory('GoogleMap', function($http, $compile){
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
    fillMap: function(scope, tweets, map){
      var locations = [];
      for (var i = 0; i < tweets.length; i++) {
        locations.push(tweets[i].coordinates);
      };

      var infowindow = new google.maps.InfoWindow({
        maxWidth: 160
      });
      var marker;
      var markers = new Array();

      var iconCounter = 0;
    
      // Add the markers and infowindows to the map
      for (var i = 0; i < locations.length; i++) {  

        if(tweets[i].coordinates){
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
            map: map
            // icon : icons[iconCounter],
            // shadow: shadow
            });
        }

      markers.push(marker);

      var content =  
        '<div id="infoWindow">'+
        '<p>'+ tweets[i].text + '</p>'+
        '<p>'+ tweets[i].user.screen_name + '</p>'+
        '<p> <strong> Sentiment </strong>' + tweets[i].sentiment + '</p>' +
        '<form class="form" ng-submit="replyTweet(text,'+index+')">' + 
          '<input class="" ng-model="text"></input>' +
          '<button class="btn btn-default btn-sm">tweet</button>' + 
        '</form>' +
        '</div>';
      var compiled = $compile(content)(scope);

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          console.log(scope);
          //scope.$apply();
          infowindow.setContent(compiled[0]);
          infowindow.open(map, marker);
        }
      })(marker, i));
      
      iconCounter++;
      // We only have a limited number of possible icon colors, so we may have to restart the counter
      if(iconCounter >= tweets.length){
        iconCounter = 0;
      }
    }

      function AutoCenter() {
        //  Create a new viewpoint bound
        var bounds = new google.maps.LatLngBounds();
        //  Go through each...
        $.each(markers, function (index, marker) {
          bounds.extend(marker.position);
        });
        //  Fit these bounds to the map
        map.fitBounds(bounds);
      }
    
      AutoCenter();
    }

	}
});

myModule.factory('Dates', function($http){
  return {
    // Formats & simplifies date for the graph
    formatDate: function(date){

      var moment_date = moment(date);
      // console.log(moment_date);
      var formattedDate = moment_date.format("MMM DD hh:mm a");
      // console.log(formattedDate);

      return formattedDate;
    }
  }
});
