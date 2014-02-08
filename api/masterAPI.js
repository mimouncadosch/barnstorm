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
	scheduleCronJob: scheduleCronJob,
	replyTweet: replyTweet,
	termImportance: termImportance
}

/**
 * gets tweets from twitter using twit
 *
 * @return {array of objects} the array of tweets
 */
function getTweets(req, res, next){
	var username = req.param('q');
	console.log('get tweets ' + username);
	T.get('search/tweets', { q: "to:" + username + ' OR ' + "from:" + username, count: 15},  function (err, results) {
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
				totalScore += parsedScore*10;	
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

	// }, funfction (err) {
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

		User.find({}, function(err, users) {
			if (err){
				return done(err);
			}
			else{

				async.forEachSeries(users, function(user, callback) {
					
					req.params['q'] = user.twitter.username;
					cronJob(req, res, function(data) {
						console.log('got user. heres the data.')
						console.log(data);						
						//"j: " + j);
						// console.log(data);
						callback();
					});
				}, function (err, tweets) {
			 		console.log("Finished scheduling a cron for all the users!");
			 		req.params['tweets'] = tweets;
			  		//if(typeof(next) == "function") { next(tweets); } else { res.json(tweets); }
			  		res.json(tweets);
				});

		// Find all users from db	
		
				// console.log("CronJob for every user: ");


				// for (var j = 0; j < users.length; j++) {
				// 	req.params['q'] = users[j].twitter.username;
				// 	cronJob(req, res, function(data) {
				// 		console.log('got user. heres the data.')
				// 		console.log("j: " + j);
				// 		console.log(data);
				// 	});
				// }
				// res.status(200);
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
	var tweetArray = [];
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
					tweetArray.push(tweet);
					callback();
				})
			});	

		}, function (err, data) {
	 		console.log("Finished cronning a user!");
	 		console.log(tweetArray.length);
	 		req.params['tweets'] = tweetArray;
	  		saveTweets(req, res, function(tweetArray) {
	  			if(typeof(next) == "function") { next(tweetArray); } else { res.json(tweetArray); }
	  		});
		});

	});	
}

function saveTweets(req, res, next) {
	console.log('save tweets');
	var tweetsArray = req.param('tweets');
	async.forEachSeries(tweetsArray, function(tweet, callback) {
		// Tweet.find({}, function(err, tweets) {
		// 	if(tweets.indexOf(tweet) == -1) {
		// 		Tweet(tweet).save();
		// 		console.log('saved');
		// 		console.log(tweet.text);
		// 	}
		// 	callback();
		// });


		var tweet_date = Date.parse(tweet.created_at);
		//console.log(tweet_date);

		var now = moment()._d;
		var now = Date.parse(now);
		//console.log(now);

		var diff = now - tweet_date;
		//console.log(diff);

		if(diff > 60000) {
		//console.log("more than a minute difference");
			console.log('not saving');
			callback();
		}
		else if(diff < 60000){
			//console.log("less than one minute ago");
			Tweet(tweet).save(function (err, tweet) {
				console.log('saved');
				callback();
			});
		}

	}, function (err) {
 		console.log("Finished saving!");
 		tweets = req.param('tweets');
 		//console.log('is tweets going through saving? ');
 		//console.log(tweets.length);
  		if(typeof(next) == "function") { next(tweets); } else { res.json(tweets); }
  		
	});

	//for (var i = tweets.length - 1; i >= 0; i--) {
		// var tweet_date = Date.parse(tweets[i].created_at);
		// //console.log(tweet_date);

		// var now = moment()._d;
		// var now = Date.parse(now);
		// //console.log(now);

		// var diff = now - tweet_date;
		// //console.log(diff);

		// if(diff > 60000) {
		// 	//console.log("more than a minute difference");
		// }
		// else if(diff < 60000){
		// 	//console.log("less than one minute ago");
		// 	Tweet(tweets[i]).save();
		// 	console.log('saved');
		// }
	//};
	//if(typeof(next) == "function") { next(tweets); } else { res.json(tweets); }
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
	console.log("user name from backend");
	// console.log(req.user.twitter.username);
	// req.user.twitter.username

	// Tweet.find({'user.screen_name': req.user.twitter.username}, function(err, tweets) {
	// 	if (err){
	// 		console.log("err");
	// 		console.log(err);
	// 		return done(err);
	// 	}
	// 	else{
	// 		console.log("Sending Tweets from DB");
	// 		console.log(tweets);
	// 		res.json(tweets);	
	// 	}
	// });

	var tweetsArray = [];

	Tweet.find({}, function (err, tweets) {

		for (var i = 0; i < tweets.length; i++) {


			// console.log("part 1");
			// console.log(tweets[i].user.screen_name);
			// console.log(req.user.twitter.username);
			// console.log("cond 1");
			// console.log(tweets[i].user.screen_name.indexOf(req.user.twitter.username));
			// console.log(tweets[i].user.screen_name.indexOf(req.user.twitter.username) != -1);

			// console.log("part 2");
			// console.log(tweets[i].text);
			// console.log(req.user.twitter.username);
			// console.log(tweets[i].text.indexOf(req.user.twitter.username != -1));

			if (tweets[i].user.screen_name.indexOf(req.user.twitter.username != -1) || (tweets[i].text.indexOf(req.user.twitter.username != -1))) 
				{
					console.log('user mentioned in tweet or user posted him/herself');

				var username = req.user.twitter.username;

				if (tweets[i].user.screen_name == username) {
					console.log("by me " + tweets[i].text);
					tweetsArray.push(tweets[i]);
				} else if (tweets[i].text.indexOf(username) != -1) {
					console.log('it talks about me');
					console.log(tweets[i].text.indexOf(username) != -1) ;

					tweetsArray.push(tweets[i]);
				} else {
					console.log('user netither mentioned in tweet or user posted him/herself');
					console.log(tweets[i]);
					//tweetsArray.push(tweets[i]);
				}
			}
		}
		res.json(tweetsArray);
	});
}



function replyTweet(req, res){

	console.log(req.params);
	// console.log(req);
	// console.log(req.param('username'));
	// console.log(req.param('text'));
	// T.post('statuses/update', { status: req.param('username') +  " " + req.param('text')}, function(err, reply) {
 // 		//...
 		// console.log("response sent");
	// })

}


function termImportance(req, res){
	var TfIdf = natural.TfIdf;
	var tfidf = new TfIdf();
	console.log("req.user.username");
	console.log(req.user.username);
	var wordImportance = [];

	Tweet.find({}, function(err, tweets) {

		if (err){
			return done(err);
		}
		else{
			console.log("Found Tweets in DB");
			// console.log(tweets);

			// Add documents to trainer
			for (var i = 0; i < tweets.length; i++) {
				tfidf.addDocument(tweets[i].text);
			}


			// Loop through tweets
			for (var i = 0; i < tweets.length; i++) {
				console.log("tweets length");
				console.log(tweets.length);

				// Tokenize every single tweet into an array
				var tokenizedTweet = tokenizer.tokenize(tweets[i].text);

				// Calculate the relative importance of every word in the tokenized array
				for (var j = 0; j < tokenizedTweet.length; j++) {
					var word = tokenizedTweet[j];
					tfidf.tfidfs(word, function(k, measure) {
						// Measure is the importance of word tokenizedTweet[j] to document k
						// console.log('document #' + k + ' is ' + measure);
						var total_importance = 0;
						if (!isNaN(measure)){
							total_importance += measure;
						}
						wordImportance.push( {word : word, measure :  measure });
						console.log(wordImportance[j]);
					});
				}
			}
		}
	});
	res.json(wordImportance);
}

// 
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
