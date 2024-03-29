


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
       //      }var parsedDates = [];
			for (var i = 0; i < data.length; i++) {

				var db_date = data[i].created_at;
				console.log("db_date: ");
				console.log(db_date);

				var JS_date = new Date(db_date);
				console.log("JS_date");
				console.log(JS_date);
				
				parsedDates.push(JS_date);
			}
			
			var parsedData = data;
			for (var i = 0; i < parsedData.length; i++) {
				var newDate = new Date(parsedData[i].created_at);
				parsedData[i].created_at = newDate;
			};

			var margin = {top: 20, right: 20, bottom: 30, left: 50},
			    width = 960 - margin.left - margin.right,
			    height = 500 - margin.top - margin.bottom;

			
			var parseDate = d3.time.format("%d-%b-%y").parse;
			var x = d3.time.scale()
			    .range([0, width]);

			var y = d3.scale.linear()
			    .range([height, 0]);

			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom");

			var yAxis = d3.svg.axis()
			    .scale(y)
			    .orient("left");

			d3.json('/api/cronJob?username=freeslugs', function(error, data) {

				var parsedData = data;
				for (var i = 0; i < parsedData.length; i++) {
					var newDate = new Date(parsedData[i].created_at);
					var day = newDate.getDay();
					var month = newDate.getMonth();
					var full_year = newDate.getFullYear();

					console.log("day: " + day + " month: " + month + " year: " + full_year);
			
						var newMonth;
						if(month == 1){
							newMonth = "Jan";
						}
						if(month == 2){
							newMonth = "Feb";
						}
						if(month == 3){
							newMonth = "Mar";
						}
						if(month == 4){
							newMonth = "Apr";
						}
						if(month == 5){
							newMonth = "May";
						}
						if(month == 6){
							newMonth = "Jun";
						}
						if(month == 7){
							newMonth = "Jul";
						}
						if(month == 8){
							newMonth = "Aug";
						}
						if(month == 9){
							newMonth = "Sep";
						}
						if(month == 10){
							newMonth = "Oct";
						}
						if(month == 11){
							newMonth = "Nov";
						}
						if(month == 12){
							newMonth = "Dec";
						}

					var full_year = " " + full_year;
					full_year = full_year.slice(-2);

					var d3_date = day + "-" + newMonth + "-" + full_year;

					console.log("Here's the d3_date: ");
					console.log(d3_date);
					parsedData[i].created_at = d3_date;
					
					parsedData[i].sentiment = parseInt(parsedData[i].sentiment);
			};

			console.log("PARSED DATA");
			console.log(parsedData);
				
			  parsedData.forEach(function(d) {
			    d.created_at = parseDate(d.created_at);
			    console.log("PARSE DATE (D.CREATED_AT) >>>>");
			    console.log(d.created_at);
			    d.sentiment = d.sentiment;
				console.log("D.SENTIMENT");
				console.log(d.sentiment);

			  });

			  x.domain(d3.extent(parsedData, function(d) { return d.created_at; }));
			  y.domain(d3.extent(parsedData, function(d) { return d.sentiment; }));


			var line = d3.svg.line()
			    .x(function(d) { return x(d.created_at); })
			    .y(function(d) { return y(d.sentiment); });

			var svg = d3.select("body").append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
			      .datum(parsedData.sentiment)
			      .attr("class", "line")
			      .attr("d", line);
			});
		}