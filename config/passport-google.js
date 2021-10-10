require('dotenv').config();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("users");

module.exports = passport => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.SELF}:${process.env.PORT}/auth/google/callback`
      },
      (accessToken, refreshToken, profile, done) => {
        User.findOne({ googleId: profile.id }, (err, user) => {
          if (!user) {
                user = new User({
                googleId: profile.id
              });
              user.save(function(err) {
                if (err) console.log(err);
                return done(err, user);
              });
          } else {
              return done(err, user);
          }
        })
      }
    )
  );
};
