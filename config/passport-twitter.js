require('dotenv').config();

const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("users");

module.exports = passport => {
  passport.use(
    new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: `${process.env.SELF}:${process.env.PORT}/auth/twitter/callback`
    },
      (token, tokenSecret, profile, done) => {
        User.findOne({ twitterId: profile.id }, (err, user) => {
          if (!user) {
            user = new User({
              twitterId: profile.id
            });
            user.save(function(err) {
              if (err) console.log(err);
              return done(err, user);
            });
          } else {
              return done(err, user);
          }
        });
      }
    )
  );
};