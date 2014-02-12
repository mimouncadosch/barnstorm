// ./api/models/user.js

// load the modules we need	
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define the schema for our user model
var tweetSchema =  new Schema({
	// GLOBALS
	user         	 					: {
        name           					: String,
        screen_name     				: String,
        location        				: String,
        url         					: String,
        followers_count					: Number,
        profile_background_image_url	: String
    },
    text: String,
	created_at: Date,
	sentiment: Number,
    coordinates : { lat: Number, lng: Number}
});

module.exports = mongoose.model('Tweet', tweetSchema);