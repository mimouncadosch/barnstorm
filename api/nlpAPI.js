var fs = require('fs');
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var twitter = require('./twitterAPI');
var mongoose = require('mongoose');
var Tweet = require('./models/tweet.js');
var schedule = require('node-schedule');


exports.sayHello = function(req, res){
	// return function(req, res){
		console.log("HELLO");
	// }
}


var words = [];
var scores = [];

exports.getSentiment = function(req, res){
	
		console.log("calling function to get sentiment");
		console.log("REQ. QUERY");
		console.log(req.query);

		
		// Create dictionary
		fs.readFile(__dirname + '/nlp-dict.txt', 'utf-8' ,function (err, data) {
			if (err) throw err;
			var lines = data.split('\n');

			for (var i = 0; i < lines.length; i++) {
				var definition = lines[i].split('\t');
				// console.log("word: " + definition[0] + " score: " + definition[1]);
				words.push(definition[0]);
				scores.push(definition[1]);
			};
		// End of creating dictionary

		//========= TIMED REQUEST FOR TWITTER =========

		/** 
		* THIS WORKS ==================================================
		*/

		// var rulesArray = [];
		// for (var i = 0; i < 60; i++) {
		// 	rulesArray.push(i);
		// };

		// for (var i = 0; i < rulesArray.length; i++) {
		// 	var rule = new schedule.RecurrenceRule();
		// 	schedule.scheduleJob(rule, function(){
		// 		console.log('The answer to life, the universe, and everything!');
		// 		var tweetsArray;
		// 		twitter.getTweets(req, function(data) {
		// 			tweetsArrayFunction(data);
		// 		});
		//     });
		// };		

		//==================================================


			// ======= THIS WORKS ========
			var tweetsArray;
			twitter.getTweets(req, function(data) {
				tweetsArrayFunction(data);
			});
			
			tweetsArrayFunction = function(tweetsArray) {

				console.log("THIS MATTERS");
				console.log(tweetsArray);


				// Tokenize tweet
				var tokenizeTweet = function(tweet){
					var tokenizedTweet = tokenizer.tokenize(tweet);
					return tokenizedTweet;
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
				var computeScore = function(tweet){
					var totalScore = 0;

					for (var i = 0; i < tweet.length; i++) {
						var token = tweet[i];
						var position = positionInDictionary(token);
						var parsedScore = parseInt(scores[position]);
						if(!isNaN(parsedScore)){
							totalScore += parsedScore;	
						}
					}
					return totalScore;
				}
				

				// Computes score for all tweets in tweetsArray array
				for (var i = 0; i < tweetsArray.length; i++) {
					var text = tweetsArray[i].text;
					var tokenizedTweet = tokenizeTweet(text);
					var twitterScore = computeScore(tokenizedTweet);
					console.log("TWITTER SCORE");
					console.log(twitterScore);


					tweetsArray[i].sentiment = twitterScore;
				};
				
				
				for (var i = 0; i < tweetsArray.length; i++) {
					var newTweet = new Tweet(tweetsArray[i]);
					console.log("HERE IS WHERE WE MAKE SURE THAT TWEETS HAVEN'T BEEN CREATED ALREADY");
					// console.log(newTweet);
					// var d = Date.parse(newTweet.created_at);
					var date = new Date(newTweet.created_at);
					var minutes = date.getMinutes();
					var hour = date.getHour();
					console.log("MINUTES: ");
					console.log(minutes);
					// if(newTweet.created_at)
					newTweet.save();
					console.log("tweet added");
				};

				// res.json(tweetsArray);
				console.log(tweetsArray);
			}
			//end of fs.readFile(...)
		});
}
