require('dotenv').config();

const passport = require('passport');
const TwitchStrategy = require('passport-twitch-strategy').Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("users");

module.exports = passport => {
  passport.use(
     new TwitchStrategy(
      {
        clientID: process.env.TWITCH_CLIENT_ID,
        clientSecret: process.env.TWITCH_CLIENT_SECRET,
        callbackURL: `${process.env.SELF}:${process.env.PORT}/auth/twitch/callback`,
        scope: "user:read:email",
        state: true
      },
      (accessToken, refreshToken, profile, done) => {
        User.findOne({ twitchId: profile.id }, (err, user) => {
          if (!user) {
            user = new User({
              twitchId: profile.id
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