var fs = require('fs');
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();


exports.sayHello = function(req, res){
	// return function(req, res){
		console.log("HELLO");
	// }
}


var words = [];
var scores = [];
exports.getSentiment = function(text){
	
		fs.readFile(__dirname + '/nlp-dict.txt', 'utf-8' ,function (err, data) {
			if (err) throw err;
			var lines = data.split('\n');

			for (var i = 0; i < lines.length; i++) {
				var definition = lines[i].split('\t');
				// console.log("word: " + definition[0] + " score: " + definition[1]);
				words.push(definition[0]);
				scores.push(definition[1]);
			};


			// var myTweet = "I think BDS is an awful organization, hypocritical and full of shit, they should mind their own business instead of making other peoples lives miserable"
			var tokenizedTweet = tokenizeTweet(text);
			var myFinalScore = computeScore(tokenizedTweet);
			console.log("THIS IS THE RETURN VERSION OF MY FINAL SCORE");
			console.log(myFinalScore);
	

			//end of fs.readFile(...)
		});

	
}

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