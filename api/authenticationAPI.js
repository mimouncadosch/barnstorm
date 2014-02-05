// ./api/authenticationAPI.js

require('./../config/passport.js');
require('passport');
/*
 * Backend routes for handling AUTHENTICATION, LOGIN, SIGNUP, & LOGOUT
 */
module.exports = function(app, passport) {

	////////////
	// TWITTER //
	////////////

	// // route for facebook authentication and login
	app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

	// handle the callback after facebook has authenticated the user
	app.get('/auth/twitter/callback',
		passport.authenticate('twitter', {
			successRedirect : '/',
			failureRedirect : '/'
		}));


	// =====================================
	// AUTHENTICATION  =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)

	app.get('/api/isLoggedin', isLoggedIn, function(req, res) {
		console.log('back-end profile page');
		res.json(req.user);
		console.log(req.user);
		// get the user JSON object out of session and pass to template
	});

	app.get('/api/notAuthenticated', function(req, res) {
		res.status(401);
		res.end();
	})

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/api/logout', function(req, res) {
		console.log("logging out");
		req.logout();
		res.redirect('/login');
	});


	////////////
	// LOCAL //
	////////////

	// process the LOGIN form
	app.post('/api/login', passport.authenticate('local-login', {
		successRedirect : '/api/isLoggedin', // redirect to the secure profile section
		failureRedirect : '/api/notAuthenticated', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));


	// process the SIGNUP form
	app.post('/api/signup', passport.authenticate('local-signup', {
		successRedirect : '/api/isLoggedin', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	///////////////
	// FACEBOOK //
	///////////////

	// // route for facebook authentication and login
	// app.get('/api/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

	// // handle the callback after facebook has authenticated the user
	// app.get('/auth/facebook/callback',
	// 	passport.authenticate('facebook', {
	// 		successRedirect : '/profile',
	// 		failureRedirect : '/'
	// 	}));

	// // =====================================
	// // AUTHENTICATION  =====================
	// // =====================================
	// // we will want this protected so you have to be logged in to visit
	// // we will use route middleware to verify this (the isLoggedIn function)

	// app.get('/api/isLoggedin', isLoggedIn, function(req, res) {
	// 	console.log('back-end profile page');
	// 	res.json(req.user);
	// 	console.log(req.user);
	// 	// get the user JSON object out of session and pass to template
	// });

	// app.get('/api/notAuthenticated', function(req, res) {
	// 	res.status(401);
	// 	res.end();
	// })



	// // =====================================
	// // LOGOUT ==============================
	// // =====================================
	// app.get('/api/logout', function(req, res) {
	// 	console.log("logging out");
	// 	req.logout();
	// 	res.redirect('/login');
	// });

};

/**
 * checks if user has already been authenticated to maintain persistent sessions
 * @return {Boolean}
 */
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    else {
    	console.log('user not logged in');
    	res.end();
    }

    // if they aren't, redirect them to the login page
    //req.flash('notLoggedIn', 'You are no longer logged in');
    //res.redirect('/login');
    
}
