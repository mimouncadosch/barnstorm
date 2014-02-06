// ./api/models/user.js

// load the modules we need	
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema =  new Schema({
	// GLOBALS
	facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
	created: Date
	// ? position: String
	
	// NEEDED FOR PASSPORT AUTHORIZATION: http://passportjs.org/guide/profile/
	// provider: String,
	// displayName: String,
	// name: {
	// 	familyName: String,
	// 	givenName: String, 
	// 	middleName: String
	// },
	// emails: [{value: String, type: String}]
});


// methods =============================
// check if password is valid using bcrypt
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

// this method hashes the password and sets the user's password
userSchema.methods.hashPassword = function(password) {
	var user = this;

	// hash the password
	bcrypt.hash(password, null, null, function(err, hash) {
		if (err)
			return next(err);

		user.local.password = hash;
	});
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);