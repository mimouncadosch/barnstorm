/**
 * Module dependencies
 */

var express = require('express'),
	passport = require('passport'),
	mongoose = require('mongoose'),
	http = require('http'),
	path = require('path'),	
	port = process.env.PORT || 3000;


var app = module.exports = express();
var configDB= require('./config/database.js');
mongoose.connect(configDB.url)

/**
Serialize & Deserialize User
*/
// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Twitter profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});


/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.cookieParser()); // read cookies (needed for user authorization)
app.use(express.bodyParser()); // get information from html forms
app.use(express.methodOverride()); 	
//app.use(app.router); – not sure if we need this
// session secret: used to compute the hash for a session.
// prevents session tampering
app.use(express.session({ secret: 'eatSLEEPraveREPEAT'}));
app.use(passport.initialize());
app.use(passport.session()); // enables persistent login sessions

// development only
if (app.get('env') === 'development') {
	app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
	// TODO
};

/**
 * Routes
 */

// serve all asset files from necessary directories
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/partials", express.static(__dirname + "/public/partials"));
app.use("/lib", express.static(__dirname + "/public/lib"));


// load user API and pass in our express app and fully configured passport
require('./api/authenticationAPI.js')(app, passport);
var twitter = require('./api/twitterAPI');
var nlp = require('./api/nlpAPI');

// JSON API
app.get('/dict', nlp.getSentiment);
app.get('/api/gettweets', twitter.getTweets); // don't use
app.get('/api/schedule', twitter.schedule);



// route for facebook authentication and login
// app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

// handle the callback after facebook has authenticated the user
// app.get('/auth/twitter/callback',
// 	passport.authenticate('twitter', {
// 		successRedirect : '/dashboard',
// 		failureRedirect : '/'
// 	}));



// redirect all others to the index (HTML5 history)
app.get("/*", function(req, res, next) {
	res.sendfile("index.html", { root: __dirname + "/public" });
});

//======================================================
// Twitter routing

// app.get('/auth/twitter',
// 	// function(req, res, next) {
// 	// 	console.log('test');
// 	// 	res.end();

// 	// 	//res.sendfile("index.html", { root: __dirname + "/public" });
// 	// });
// passport.authenticate('twitter'));

// app.get('/auth/twitter/callback', 
// 	passport.authenticate('twitter', { failureRedirect: '/login' }),
// 	function(req, res) {
		
//     // Successful authentication, redirect home.
//     console.log(req.user);
//     res.redirect('/home');
// });






// launch ==============================================================================

//In your browser, go to http://localhost:<port>
app.listen(port);
console.log("Listening on port " + port);