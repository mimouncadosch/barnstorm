var oauth = require('./models/oauth.js');
var request = require('request');


module.exports = function(app, passport) {

	app.get('/api/gettweet', getTweets, function(req, res) {
		console.log('calling function to get tweets');
		res.json(getTweets());
	});
}



function getTweets(req, res){
	// get url string and convert to json object
	// var query = req._parsedUrl.query;
	// var objParams = queryString.parse(query);

	//grab params and set defaults
	// var query = objParams.q;
	var url = "https://api.twitter.com/1.1/search/tweets.json?q=haim";

	request(url, function(err, result){
		var myResult = JSON.parse(result.body);
		res.json(myResult);
	})
}
	


// Get all the tweets within a radius
function getGeoTweets(req, res){
		var query = req.parsedUrl.query;
		var objParams = queryString.parse(query);

		var latitude 	=  		objParams.latitude;
		var longitude 	= 		objParams.longitude;
		var radius 		= 		objParams.radius;
}

