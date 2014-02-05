/**
 * Module dependencies
 */

var express = require('express'),
	passport = require('passport'),
	TwitterStrategy = require('passport-twitter').Strategy,
	api = require('./routes/api'),
	http = require('http'),
	path = require('path'),	
	port = process.env.PORT || 3000;

var app = module.exports = express();


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
// load item API and pass in our express app
//require('./api/itemAPI.js')(app);
// load user API and pass in our express app
require('./api/twitterAPI.js')(app);


// JSON API
app.get('/api/name', api.name);



// redirect all others to the index (HTML5 history)
app.all("/*", function(req, res, next) {
	res.sendfile("index.html", { root: __dirname + "/public" });
});


// launch ==============================================================================

//In your browser, go to http://localhost:<port>
app.listen(port);
console.log("Listening on port " + port);