var oauth = require('./models/oauth.js');
var request = require('request');
var queryString = require('querystring');
var Twit = require('twit');

var nlp = require('./nlpAPI');

var T = new Twit({
    consumer_key:         'yxDatKN48oYTeKqOft5ciA'
  , consumer_secret:      '9xwrzRwL2D53iXTxNQ8hSQ95TydiJo2n5dGzkBHYXBI'
  , access_token:         '253580597-gmn5RLdmdpCQRLeBiVYo7vqqEsxRHz2bkeS1o2Vb'
  , access_token_secret:  'QuQvCxnXHFHV5EQM0DgOvG6CfLlyZtsoIANihDdGMI1yZ'
})


module.exports = function(app, passport) {
	app.get('/api/gettweets', getTweets());
}

// Pulls tweets based on a query
function getTweets(){
	return function(req, res){
		// get url string and convert to json object
		var query = req._parsedUrl.query;
		var objParams = queryString.parse(query);

		// grab params and set defaults
		var query = objParams.q;
		console.log(query);
		console.log('calling function to get tweets');
		
		T.get('statuses/user_timeline', { screen_name: query, count: 15},  function (err, result) {
			for (var i = 0; i < result.length; i++) {
				var item = result[i];
	      	// console.log(result[i]);
	      	// console.log(result[i].id);
	      	console.log(result[i].text);
	      	// console.log(result[i].user.name);
	      	// console.log(result[i].user.screen_name);
	      	// console.log(result[i].user.location);
	      	// console.log(result[i].user.description);
	      	// console.log(result[i].user.url);
	      	// console.log(result[i].user.followers_count);
	      	// console.log(result[i].created_at);
	      	// console.log(result[i].user.profile_background_image_url);

	      	console.log("Sentiment Score: ");
	      	nlp.getSentiment(result[i].text);
	      }
	      console.log("total tweets: " + result.length);

	      res.send("We're done");

	  	});
	}
}

// Get all the tweets within a radius
function getGeoTweets(req, res){
		var query = req.parsedUrl.query;
		var objParams = queryString.parse(query);

		var latitude 	=  		objParams.latitude;
		var longitude 	= 		objParams.longitude;
		var radius 		= 		objParams.radius;
}

