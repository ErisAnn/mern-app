require('dotenv').config();

const passport = require('passport');
const TwitchStrategy = require('passport-twitch').Strategy
const mongoose = require("mongoose");
const User = mongoose.model("users");

module.exports = passport => {
  passport.use(
    new TwitchStrategy(
      {
        clientID: process.env.TWITCH_CLIENT_ID,
        clientSecret: process.env.TWITCH_CLIENT_SECRET,
        callbackURL: "https://localhost:3000/auth/twitch/callback",
        scope: "user_read"
      },
      (accessToken, refreshToken, profile, done) => {
        User.findOrCreate({ discordId: profile.id }, (err, user) => {return done(err, user);
        });
      }
    )
  );
};

