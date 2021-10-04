require('dotenv').config();

const passport = require('passport')
const TwitterStrategy = require('passport-twitter').Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("users");

module.exports = passport => {
  passport.use(new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: "https://localhost:3000/auth/twitter/callback"
    },
    (token, tokenSecret, profile, done) => {
      User.findOrCreate({ twitterId: profile.id }, (err, user) => {
        if (err) { return done(err); }
        done(null, user);
      });
    }
  ));
};