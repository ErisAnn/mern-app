require('dotenv').config();

const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy
const mongoose = require("mongoose");
const User = mongoose.model("users");

const scopes = ['identify', 'email', 'guilds', 'guilds.join'];

module.exports = passport => {
  passport.use(
    new DiscordStrategy(
      {
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: "https://localhost:3000/auth/discord/callback",
        scope: scopes
      },
      (accessToken, refreshToken, profile, cb) => {
        User.findOrCreate({ discordId: profile.id }, (err, user) => {return cb(err, user);
        });
      }
    )
  );
};

