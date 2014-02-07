// config/passport.js
// Sources: https://github.com/mjhea0/passport-examples/blob/master/

var passport = require('passport'),
FacebookStrategy = require('passport-facebook').Strategy,
TwitterStrategy = require('passport-twitter').Strategy,
GithubStrategy = require('passport-github').Strategy,
GoogleStrategy = require('passport-google').Strategy;
//var User = require('./user.js')
var config = require('./../api/models/oauth.js')
var User = require('../api/models/user.js');
// config

module.exports = passport.use(new TwitterStrategy({
  consumerKey: "yxDatKN48oYTeKqOft5ciA",
  consumerSecret: "9xwrzRwL2D53iXTxNQ8hSQ95TydiJo2n5dGzkBHYXBI",
  callbackURL: "http://127.0.0.1:3000/auth/twitter/callback" //http://tweetthepress.heroku.com/auth/twitter/callback
},
  function(token, tokenSecret, profile, done) {
    console.log(profile);
    User.findOne({'twitter.id' :  profile.id}, function(err, user) { 
      console.log('and whatd you find');
      console.log(user);
      if(err) { console.log(err); }
      if (!err && user != null) {
        console.log(user);
        return done(null, user);
      } else {
        var user = new User({
          twitter: {
            id: profile.id,
            token: token,
            displayName: profile.displayName,
            username: profile.username
          },
          created: Date.now()
        });
        user.save(function(err) {
          if(err) {
            console.log(err);
          } else {
            console.log("saving user ...");
            console.log(user);
            return done(null, user);
          };
        });
      }
    });
  }
));



  
  // User.findOrCreate({ twitterId: profile.id }, function (err, user) {
  //   return done(err, user);
  // });
  // console.log(profile.id);
  // console.log(token);
  // console.log(tokenSecret);

  //return done(null, {myToken: token, myTokenSecret: tokenSecret, id: profile.id});
  


module.exports = passport.use(new FacebookStrategy({
  clientID: config.facebook.clientID,
  clientSecret: config.facebook.clientSecret,
  callbackURL: config.facebook.callbackURL
},
function(accessToken, refreshToken, profile, done) {
  User.findOne({ oauthID: profile.id }, function(err, user) {
    if(err) { console.log(err); }
    if (!err && user != null) {
      done(null, user);
    } else {
      var user = new User({
        oauthID: profile.id,
        name: profile.displayName,
        created: Date.now()
      });
      user.save(function(err) {
        if(err) { 
          console.log(err); 
        } else {
          console.log("saving user ...");
          done(null, user);
        };
      });
    };
  });
}
));



passport.use(new GithubStrategy({
 clientID: config.github.clientID,
 clientSecret: config.github.clientSecret,
 callbackURL: config.github.callbackURL
},
function(accessToken, refreshToken, profile, done) {
 User.findOne({ oauthID: profile.id }, function(err, user) {
   if(err) { console.log(err); }
   if (!err && user != null) {
     done(null, user);
   } else {
     var user = new User({
       oauthID: profile.id,
       name: profile.displayName,
       created: Date.now()
     });
     user.save(function(err) {
       if(err) { 
         console.log(err); 
       } else {
         console.log("saving user ...");
         done(null, user);
       };
     });
   };
 });
}
));
passport.use(new GoogleStrategy({
 returnURL: config.google.returnURL,
 realm: config.google.realm
},
function(accessToken, refreshToken, profile, done) {
 User.findOne({ oauthID: profile.id }, function(err, user) {
   if(err) { console.log(err); }
   if (!err && user != null) {
     done(null, user);
   } else {
     var user = new User({
       oauthID: profile.id,
       name: profile.displayName,
       created: Date.now()
     });
     user.save(function(err) {
       if(err) { 
         console.log(err); 
       } else {
         console.log("saving user ...");
         done(null, user);
       };
     });
   };
 });
}
));