//node pre-installed
var fs = require('fs');

//node manual installed
var request = require('request');
var mongoose = require('mongoose');
var schedule = require('node-schedule');
var async = require('async');
var natural = require('natural');
var queryString = require('querystring');
var moment = require('moment');
var request = require('request');
moment().format();

//models
var oauth = require('./models/oauth.js');
var User = require('./models/user.js');
var Tweet = require('./models/tweet.js');

//twitter?
var Twit = require('twit');
var T = new Twit({
    consumer_key:         'yxDatKN48oYTeKqOft5ciA'
  , consumer_secret:      '9xwrzRwL2D53iXTxNQ8hSQ95TydiJo2n5dGzkBHYXBI'
  , access_token:         '253580597-gmn5RLdmdpCQRLeBiVYo7vqqEsxRHz2bkeS1o2Vb'
  , access_token_secret:  'QuQvCxnXHFHV5EQM0DgOvG6CfLlyZtsoIANihDdGMI1yZ'
})

//nlp
var tokenizer = new natural.WordTokenizer();

module.exports = {
	getTweets: getTweets,
	getSentiment: getSentiment,
	cronJob : cronJob,
	getTweetsFromDB: getTweetsFromDB,
	getCoordinates: getCoordinates, 
	scheduleCronJob: scheduleCronJob
}

/**
 * gets tweets from twitter using twit
 *
 * @return {array of objects} the array of tweets
 */
function getTweets(req, res, next){
	var username = req.param('q');
	console.log('get tweets ' + username);
	T.get('search/tweets', { q: "to:" + username + ' OR ' + "from:" + username, count: 5},  function (err, results) {
		//console.log('results');
		//console.log(results);
		var tweetArray = [];
		for (var i = 0; i < results.statuses.length; i++) {
			var item = results.statuses[i];
			//console.log(item.user);
			var tweet = {
				user: {
					name: item.user.name,
					screen_name: item.user.screen_name,
					location: item.user.location,
					//url: results[i].user.url, 
					followers_count: item.user.followers_count, 
					profile_background_image_url: item.user.profile_background_image_url, 
				},
				text: item.text,
				// location: , 
				created_at: item.created_at,
				sentiment: 0
			};
			tweetArray.push(tweet);
		}
		// res.json(tweetArray);
		if(typeof(next) == "function") { next(tweetArray); } else { res.json(tweetArray); }
	});
}

/**
 * gets sentiment of text
 * 
 * @return {array} the array of texts
 */
function getSentiment(req, res, next){
	var text = req.param('text');

	var words = [];
	var scores = [];

 	fs.readFile(__dirname + '/nlp-dict.txt', 'utf-8', function (err, data) {
 		if (err) throw err;
 		var lines = data.split('\n');

 		for (var i = 0; i < lines.length; i++) {
 			var definition = lines[i].split('\t');
			words.push(definition[0]);
			scores.push(definition[1]);
		};

		var tokenizedText = tokenizeText(text);
		var score = computeScore(tokenizedText);
		if(next) { next(score); } else { res.json(score); }

	});

	var tokenizeText = function(text){
		var tokenizedText = tokenizer.tokenize(text);
		return tokenizedText;
	}

	// Finds if a word is in array words[]
	var positionInDictionary = function(word){
		for (var i = 0; i < words.length; i++) {
			if (word == words[i]){
				return i;
			}	
		}
		return -1;
	}

	// Calculates score of individual tweet
	var computeScore = function(text){
		totalScore = 0;
		for (var i = 0; i < text.length; i++) {
			var token = text[i];
			var position = positionInDictionary(token);
			var parsedScore = parseInt(scores[position]);
			if(!isNaN(parsedScore)){
				totalScore += parsedScore;	
			}
		}
		return totalScore;
	}
};
function scheduleCronJob(req, res) {
	console.log('start cron job schedular');
	var rulesArray = [];
	// create array of minutes
	for (var i = 0; i < 60; i++) {
		rulesArray.push(i);
	};



	// async.forEachSeries(tweets, function(tweet, callback) {
	// 	var text = tweet.text;
	// 	//console.log(text);
	// 	req.params['text'] = text; 
	// 	getSentiment(req, res, function(score) {
	// 		//console.log(text + score);
	// 		tweet.sentiment = score;
	// 		req.params['location'] = tweet.user.location;
	// 		getCoordinates(req, res, function(coordinates) {
	// 			tweet.user.coordinates = coordinates;
	// 			callback();
	// 		})
	// 	});	

	// }, function (err) {
 // 		console.log("Finished!");
 // 		req.params['tweets'] = tweets;
 //  		saveTweets(req, res, function(tweets) {
 //  			if(typeof(next) == "function") { next(tweets); } else { res.json(tweets); }
 //  		});
	// });



	for (var i = 0; i < rulesArray.length; i++) {
		var rule = new schedule.RecurrenceRule();
	};
	schedule.scheduleJob(rule, function(){

		// Find all users from db	
		User.find({}, function(err, users) {
			if (err){
				return done(err);
			}
			else{
				console.log("CronJob for every user: ");

				for (var j = 0; j < users.length; j++) {
					req.params['q'] = users[j].twitter.username;
					cronJob(req, res, function(data) {
						console.log('got user. heres the data.')
						console.log("j: " + j);
						console.log(data);
					});
				}

				//res.json(tweets);	
			}
		});


		// // console.log('The answer to life, the universe, and everything!');
		// cronJob(req, res, function (data) {
		// 	console.log('CronJob response');
		// 	console.log(data);
		// });
    });
}


function cronJob(req, res, next) {
	//var username = 'MPCadosch';
	//req.params['q'] = req.param('q');
	getTweets(req, res, function(tweets) {
		async.forEachSeries(tweets, function(tweet, callback) {
			var text = tweet.text;
			//console.log(text);
			req.params['text'] = text; 
			getSentiment(req, res, function(score) {
				//console.log(text + score);
				tweet.sentiment = score;
				req.params['location'] = tweet.user.location;
				getCoordinates(req, res, function(coordinates) {
					tweet.user.coordinates = coordinates;
					callback();
				})
			});	

		}, function (err) {
	 		console.log("Finished!");
	 		req.params['tweets'] = tweets;
	  		saveTweets(req, res, function(tweets) {
	  			if(typeof(next) == "function") { next(tweets); } else { res.json(tweets); }
	  		});
		});

	});	
}

function saveTweets(req, res, next) {
	var tweets = req.params['tweets'];
	for (var i = tweets.length - 1; i >= 0; i--) {
		var tweet_date = Date.parse(tweets[i].created_at);
		//console.log(tweet_date);

		var now = moment()._d;
		var now = Date.parse(now);
		//console.log(now);

		var diff = now - tweet_date;
		//console.log(diff);

		if(diff > 60000) {
			//console.log("more than a minute difference");
		}
		else if(diff < 60000){
			//console.log("less than one minute ago");
			Tweet(tweets[i]).save();
			console.log('saved');
		}
	};
	if(typeof(next) == "function") { next(tweets); } else { res.json(tweets); }
};


function getCoordinates(req, res, next){

	var location = req.param('location');

	var geocoding = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + location + "&sensor=false";

	request(geocoding, function(err, result) {
		if(err) {
			console.log("BAAAD");
			console.log(err);
		}
		var content = result.body;
		var parsed_content = JSON.parse(content);

		if(parsed_content.results[0]){
			var coordinates = parsed_content.results[0].geometry.location;	
		}
		else if(!(parsed_content.results[0])){
			var coordinates = null;
		}
		if(typeof(next) == "function") { next(coordinates); } else { res.json(coordinates); }
	})
}


function getTweetsFromDB(req, res) {
	Tweet.find({'twitter.username': req.user.username}, function(err, tweets) {
		if (err){
			return done(err);
		}
		else{
			console.log("Sending Tweets from DB");
			console.log(tweets);
			res.json(tweets);	
		}
	});
}

//}

		// for (var i = 0; i < tweets.length; i++) {
		// 	var text = tweets[i].text;
		// 	req.params['text'] = text; 
		// 	getSentiment(req, res, function(score) {
		//  	console.log(i);
		// 		console.log(score);
		// 	});
		// 	//tweetsArray[i].sentiment = twitterScore;
		// };
		
		// async.forEachSeries(tweets, function(tweet, callback) {
		// 	var text = tweet.text;
		// 	console.log(text);
		// 	req.params['text'] = text; 
		// 	//getSentiment(req, res, callback);
		// 	getSentiment(req, res, function(score) {
		// 		console.log(text + score);
		// 		tweet.sentiment = score;
		// 		callback();
		// 	});

		// }, function(err) {
  //       	if (err) {
  //       		console.log("we're done");
  //       	}
	 //        //Tell the user about the great success
	 //        res.json(tweets);
	 //        //saveTweets(tweets);
	 //    });


	// console.log("TWITTER SCORE");
	// console.log(twitterScore);
	// tweetsArray[i].sentiment = twitterScore;

// 	var newTweet = new Tweet(tweetsArray[i]);
// 	console.log("HERE IS WHERE WE MAKE SURE THAT TWEETS HAVEN'T BEEN CREATED ALREADY");
// 	// console.log(newTweet);
// 	// var d = Date.parse(newTweet.created_at);
// 	var date = new Date(newTweet.created_at);
// 	var minutes = date.getMinutes();
// 	var hour = date.getHour();
// 	console.log("MINUTES: ");
// 	console.log(minutes);
// 	// if(newTweet.created_at)
// 	newTweet.save();
// 	console.log("tweet added");
// };

// res.json(tweetsArray);
//console.log(tweetsArray);



	// request('http://127.0.0.1:3000/api/getTweets', function (error, response, data) {
	// 	console.log(data);
	// })	
