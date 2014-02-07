var oauth = require('./models/oauth.js');
var request = require('request');
var queryString = require('querystring');
var Twit = require('twit');
var nlp = require('./nlpAPI');
var User = require('./models/user.js');
var schedule = require('node-schedule');

var T = new Twit({
    consumer_key:         'yxDatKN48oYTeKqOft5ciA'
  , consumer_secret:      '9xwrzRwL2D53iXTxNQ8hSQ95TydiJo2n5dGzkBHYXBI'
  , access_token:         '253580597-gmn5RLdmdpCQRLeBiVYo7vqqEsxRHz2bkeS1o2Vb'
  , access_token_secret:  'QuQvCxnXHFHV5EQM0DgOvG6CfLlyZtsoIANihDdGMI1yZ'
})


// Pulls tweets based on a query
exports.getTweets = function(req, cb){

	// get url string and convert to json object
	// var query = req._parsedUrl.query;
	// var objParams = queryString.parse(query);
	// // grab params and set defaults
	// var query = objParams.q;
	// console.log(query);
	console.log('calling function to get tweets');
	console.log("REQ.USER");
	console.log(req.user);

	User.find( function(err, users){
		console.log("USER FIND IS BEING CALLED");
		console.log("USER :");
		console.log(users);
		for (var i = 0; i < users.length; i++) {
			getTweets(users[i]);
		};
		// res.json(user);
	});
	
	function getTweets(user) {
		console.log("calling getTweets()");
		console.log("is get tweets getting user from db?");
		console.log(user);
		var user_name = user.twitter.username;
		
		T.get('statuses/user_timeline', { screen_name: user_name, count: 3},  function (err, results) {
			var tweetArray = [];

			for (var i = 0; i < results.length; i++) {
				var item = results[i];

				var tweetObject = {
					user: {
						name: results[i].user.name,
						screen_name: results[i].user.screen_name,
						location: results[i].user.location,
						url: results[i].user.url, 
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
}
		


exports.findUser = function(req, res){
	console.log("is Find User being Called?");
	console.log("REQ.USER");
	console.log(req.user);
	var username = req.user.twitter.username;
	User.find( function(err, user){
		console.log("USER FIND IS BEING CALLED");
		console.log("USER :");
		console.log(user);
		// getTweets(user);
		res.json(user);
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

