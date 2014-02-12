'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var myModule = angular.module('myApp.services', []);
myModule.factory('auth', ['$rootScope', '$http', '$location', function($rootScope, $http, $location) {
 //  function isLoggedin() {
 //  	$http.get('/api/isLoggedin').success(function(data, status, headers, config) {
 //  		$rootScope.user = data;
	// }).error(function (data, status, headers, config) {
	// 	if(status == 401) {
	// 		$location.path('/landing');
	// 	}
	// });
 //  }
 //  return isLoggedin();
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

			//console.log(tweets);
			var locations = [];
      var markers = [];
      var infowindows = [];

			for (var i = 0; i < tweets.length; i++) {
           console.log(tweets[i]);
          if(tweets[i].coordinates){

              var myLatLng = new google.maps.LatLng(tweets[i].coordinates.lat, tweets[i].coordinates.lng);
              var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
              });
             
              var contentString =  
              '<div id="infoWindow">'+
              '<p>'+ tweets[i].text + '</p>'+
              '<p>'+ tweets[i].user.screen_name + '</p>'+
              '<p>'+ tweets[i].user.followers_count + '</p>'+
              '<p> <strong> Sentiment </strong>' + tweets[i].sentiment + '</p>'
              + '<button ng-click="reply()">reply</button>'
              + '</div>';

              // '<h2>' + locations[i].user.followers_count + '</h2>'+
                      
              var infowindow = new google.maps.InfoWindow({
                content: contentString
              });
              google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map,marker);
              });
          }
			};
		},

    fillMap: function(tweets, map){

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

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(tweets[i].text);
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

      function formatMonth(month){
        if(month == 0)
          return "Jan";
        if(month == 1)
          return "Feb";
      }
      function formatDay(day){
        if(day == 0)
          return "Sun";
        if(day == 1)
          return "Mon";
        if(day == 2)
          return "Tue";
      }

      //Create JS Date object
      var myDate = new Date(date);

      var date_of_month = myDate.getDate();
      var hours = myDate.getHours();
      var minutes = myDate.getMinutes();
      var month = formatMonth(myDate.getMonth());
      var day_of_week = formatDay(myDate.getDay());

      var formattedDate = day_of_week + ", " + month + " " + date_of_month + ", " + hours + ":" + minutes;

      return formattedDate;
    }
  }

});

        // var markerArray = [];
        // var windowArray = [];
        // var contentArray = [];

        // for (var i = 0; i < tweets.length; i++) {
        //     if(tweets[i].user.coordinates){

        //       var myLatLng = new google.maps.LatLng(tweets[i].user.coordinates.lat, tweets[i].user.coordinates.lng);
        //       var marker = new google.maps.Marker({
        //           position: myLatLng,
        //           map: map,
        //       });
        //       markerArray.push(marker);
        //     }

        //   var contentString =  
        //       '<div id="infoWindow">'+
        //       '<p>'+ tweets[i].text + '</p>'+
        //       '<p>'+ tweets[i].user.screen_name + '</p>'+
        //       '<p>'+ tweets[i].user.followers_count + '</p>'+
        //       '<p> <strong> Sentiment </strong>' + tweets[i].sentiment + '</p>'
        //       + '</div>';
        //   contentArray.push(contentString);

        //   var infoWindow = new google.maps.InfoWindow({
        //         content: contentString
        //   });

        //   windowArray.push(infoWindow);

        // }

        // for (var i = 0; i < tweets.length; i++) {
        //   // console.log("markerArray[i]");
        //   // console.log(markerArray[i]);
        //   // console.log("contentArray[i]");
        //   // console.log(contentArray[i]);
        //   // console.log("windowArray[i]");
        //   // console.log(windowArray[i]);


        // };


        // for (var i = 0; i < tweets.length; i++) {
        //   google.maps.event.addListener(markerArray[i], 'click', function() {
        //         windowArray[i].open(map,markerArray[i]);
        //       });
        // };



       // var markers = [];
       // var infowindows = [];

       //      // add shops or malls
       //      for (var key in tweets) {
       //        if (tweets[key].user.coordinates){
       //            infowindows[key] = new google.maps.InfoWindow({
       //            content: tweets[key].infowindow
       //          });

       //          markers[key] = new google.maps.Marker({
       //            position: new google.maps.LatLng(tweets[key].user.coordinates.lat, tweets[key].user.coordinates.lng),
       //            map: map,
       //            title: tweets[key].text
       //          });
       //          // var iconFile = 'http://maps.google.com/mapfiles/ms/icons/'+marker_color+'-dot.png';
       //          // markers[key].setIcon(iconFile);

       //          google.maps.event.addListener(markers[key], 'click', function(innerKey) {
       //            return function() {
       //              infowindows[innerKey].open(map, markers[innerKey]);
       //            }
       //          }(key));
       //        }
       //      }