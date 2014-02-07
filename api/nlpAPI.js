var fs = require('fs');
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var twitter = require('./twitterAPI');
var mongoose = require('mongoose');
var Tweet = require('./models/tweet.js');
//var async = require('async');
exports.sayHello = function(req, res){
	// return function(req, res){
		console.log("HELLO");
	// }
}


var words = [];
var scores = [];

exports.getSentiment = function(req, res){
	
		console.log("calling function to get sentiment");
		
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



			var tweetsArray;
			twitter.getTweets(function(data) {
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
				

				// var totalSentiment = 0;

				for (var i = 0; i < tweetsArray.length; i++) {
					var text = tweetsArray[i].text;
					var tokenizedTweet = tokenizeTweet(text);
					var twitterScore = computeScore(tokenizedTweet);
					console.log("TWITTER SCORE");
					console.log(twitterScore);
					// totalSentiment += twitterScore;


					tweetsArray[i].sentiment = twitterScore;
				};
				
				res.json(tweetsArray);
				console.log(tweetsArray);

				for (var i = 0; i < tweetsArray.length; i++) {
					var newTweet = new Tweet(tweetsArray[i]);	
					newTweet.save();
					console.log("tweet added");
				};
			}
			//end of fs.readFile(...)
		});
}
