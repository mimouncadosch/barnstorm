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
var cronJob = require('cron').CronJob;
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
	// cronJob : cronJob,
	getTweetsFromDB: getTweetsFromDB,
	getCoordinates: getCoordinates, 
	//scheduleCronJob: scheduleCronJob,
	replyTweet: replyTweet,
	termImportance: termImportance,
	donateToUs: donateToUs
}

/**
 * creates a cron job, every minute
 */
new cronJob('0 * * * * *', function() {
	// find all users
	User.find({}, function(err, users) {
		// error handling
		if (err){
			return done(err);
		}
		else{
			// async loop for each user
			async.forEachSeries(users, function(user, cb1) {				
				console.log('get tweets ' + user.twitter.username);
				// get the tweets for each user
				getTweets(user.twitter.username, function(tweetArray) {
					// for each tweet, anaylze sentiment and get coordinates
					async.forEachSeries(tweetArray, function(tweet, cb2) {
						// anaylze sentiment, nlp
						getSentiment(tweet.text, function(score) {
							tweet.sentiment = score;
							// get coordinates of person who tweeted
							getCoordinates(tweet.user.location, function(coordinates) {
								tweet.coordinates = coordinates;
								// if its a recent tweet save 
								saveTweet(tweet, function() {
									// callback for the inner loop
									cb2();
								});
							});								
						});
					}, function() {
						// callback for the outer loop
						cb1();
					});			
				});
			});
		} //else
	});	// user find
}, null, true);	

/**
 * gets tweets from twitter using twit
 * To also pull tweets from user, + ' OR ' + "from:" + username
 * @return {array of objects} the array of tweets
 */
function getTweets(username, callback){
	T.get('search/tweets', { q: "to:" + username, count: 3}, function (err, results) {
		var tweetArray = [];
		if(!results) {
			callback(tweetArray);
		} 
		else {


			for (var i = 0; i < results.statuses.length; i++) {
				var item = results.statuses[i];
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
					created_at: item.created_at,
					sentiment: 0
				};
				tweetArray.push(tweet);
			}
			callback(tweetArray);
		}
	});
}

/**
 * gets sentiment of text
 * 
 * @return {integer} the score of the text
 */
function getSentiment(text, callback){

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
		callback(score);

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

/**
 * gets the coordinates from a location
 * @param  {String}   location the name of the place, ex. New York, NY
 * @param  {Function} callback
 * @return {Object}            object of coordinates containing lat & lng
 */
function getCoordinates(location, callback){

	var geocoding = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + location + "&sensor=false";

	request(geocoding, function(err, result) {
		if(err) {
			console.log("BAAAD");
			console.log(err);
		}
		var content = result.body;
		var parsed_content = JSON.parse(content);

		if(parsed_content.results[0]){
			console.log(parsed_content.results[0].geometry.location);

			if(parsed_content.results[0]){
				var coordinates = parsed_content.results[0].geometry.location;	
			}
			else if(!(parsed_content.results[0])){
				var coordinates = null;
			}
			callback(coordinates);
			
		}
		
	})
}

/** 
 * saves tweet to mongodb 
 * @param  {Object}   tweet    da tweet object
 * @param  {Function} callback 
 */
function saveTweet(tweet, callback) {

	var tweet_date = Date.parse(tweet.created_at);
	var now = moment()._d;
	var now = Date.parse(now);
	var diff = now - tweet_date;

	/**
	TO DO: CHECK IF TWEET IS IN DATABASE 
	*/

	if(diff > 120000) {
		callback();
	}
	else if(diff < 120000){
		Tweet(tweet).save(function (err, tweet) {
			console.log('saved. TWEET ' + tweet.text); 
			callback();
		});
	}
};

/**
 * retrieves tweets from mongodb
 * @return {Array}     Array of tweets 
 */
function getTweetsFromDB(req, res) {
	if(!req.user) {
		console.log('no user');
		res.redirect('/');
	} else {
		console.log("req.user");
		console.log(req.user);
		var tweetsArray = [];	
		Tweet.find({}, function (err, tweets) {
			for (var i = 0; i < tweets.length; i++) {
				if (tweets[i].text.indexOf(req.user.twitter.username) != -1)  //tweets[i].user.screen_name.indexOf(req.user.twitter.username != -1) || 
				{
					// console.log('This should show ONLY tweets including @Mimoun in the text');
					// console.log(tweets[i]);
					tweetsArray.push(tweets[i]);

				}
			}
			console.log("tweetsArray");
			console.log(tweetsArray);
			res.json(tweetsArray);
		});	
	}
	
}

function replyTweet(req, res){

	console.log("Calling reply tweet");
	// console.log(req);
	var username = req.query.screen_name;
	var text = req.query.text;
	// console.log(req);
	// console.log(req.param('username'));
	// console.log(req.param('text'));
	T.post('statuses/update', { status: "@" + username + " " + text}, function(err, reply) {
 		res.send("response sent");
	})

}

/***************** end of work by gilad **********************/


function termImportance(req, res){
	var TfIdf = natural.TfIdf;
	var tfidf = new TfIdf();

	// Add all tweets to corpus, and find relevance of single world to entire corpus
	var corpus;
	var word_importance;
	Tweet.find({}, function(err, tweets) {

		if (err){
			return done(err);
		}
		else{
			console.log("Found Tweets in DB");
			// console.log(tweets);

			for (var i = 0; i < tweets.length; i++) {
				tfidf.addDocument(tweets[i].text);
				console.log(tweets[i].text);
			};
			
			console.log('Adding scores ------------------------------------------');
			var word = "best";
			var word_score = 0;
			tfidf.tfidfs(word, function(i, measure) {
				console.log('document #' + i + ' is ' + measure);
				word_score += measure;
			});

			var word_importance = {
				word: word,
				score: word_score
			};
			console.log("WORD_IMPORTANCE");
			console.log(word_importance);
		}
	});
	return word_importance;
}


function termImportance_old(req, res){
	var TfIdf = natural.TfIdf;
	var tfidf = new TfIdf();
	console.log("req.user.username");
	console.log(req.user.username);
	
	// Add all tweets to corpus, and find relevance of single world to entire corpus
	var corpus = [];

	Tweet.find({}, function(err, tweets) {

		if (err){
			return done(err);
		}
		else{
			console.log("Found Tweets in DB");
			// console.log(tweets);

			// Add tweets to corpus
			for (var i = 0; i < tweets.length; i++) {
				corpus.push(tweets[i]);
			};

			
			// Add documents to trainer
			tfidf.addDocument(corpus);
			// for (var i = 0; i < tweets.length; i++) {
			// 	tfidf.addDocument(tweets[i].text);
			// };

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

function donateToUs(req, res) {
	var accessToken = req.param('access_token');

	request.post({
	  url:     'https://api.venmo.com/v1/payments',
	  form: { 
	  	access_token: accessToken,
	  	email: 'freeslugs@gmail.com',
	  	note: 'donation to barnstorm', 
	  	amount: 5
	  }
	}, function(error, response, body){
		res.redirect('/thankyou');
	});
}


