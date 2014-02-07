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


// Pulls tweets based on a query
exports.getTweets = function(cb){

	// get url string and convert to json object
	// var query = req._parsedUrl.query;
	// var objParams = queryString.parse(query);
	// // grab params and set defaults
	// var query = objParams.q;
	// console.log(query);
	console.log('calling function to get tweets');

	
	T.get('statuses/user_timeline', { screen_name: "penn", count: 20},  function (err, results) {
		var tweetArray = [];

		for (var i = 0; i < results.length; i++) {
			var item = results[i];
			
			var tweetObject = {
				user: {
					user_name: results[i].user.name,
					user_screen_name: results[i].user.screen_name,
					user_location: results[i].user.location,
					user_url: results[i].user.url, 
					followers_count: results[i].user.followers_count, 
					profile_background_image_url: results[i].user.profile_background_image_url, 
				},
				text: results[i].text,
				// location: , 
				created_at: results[i].created_at,
				sentiment: 0
			};
			tweetArray.push(tweetObject);
      	}
      	cb(tweetArray);
      	// res.json(tweetArray);
      	//return tweetArray;
	});
}
		





// Get all the tweets within a radius
// function getGeoTweets(req, res){
// 		var query = req.parsedUrl.query;
// 		var objParams = queryString.parse(query);

// 		var latitude 	=  		objParams.latitude;
// 		var longitude 	= 		objParams.longitude;
// 		var radius 		= 		objParams.radius;
// }

