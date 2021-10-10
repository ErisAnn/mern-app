require('dotenv').config();

const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("users");

const scopes = ['identify', 'email', 'guilds', 'guilds.join'];

module.exports = passport => {
  passport.use(
    new DiscordStrategy(
      {
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: `${process.env.SELF}:${process.env.PORT}/auth/discord/callback`,
        scope: scopes
      },
      (accessToken, refreshToken, profile, cb) => {
        User.findOne({ discordId: profile.id }, (err, user) => {
          if (!user) {
            user = new User({
              discordId: profile.id
            });
            user.save(function(err) {
              if (err) console.log(err);
              return cb(err, user);
            });
          } else {
              return cb(err, user);
          }
        });
      }
    )
  );
};