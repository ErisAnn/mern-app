const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    default: "",
    unique: true
  },
  email: {
    type: String,
    default: ""
  },
  password: {
    type: String,
    default: ""
  },
  date: {
    type: Date,
    default: Date.now
  },
  googleId: {
    type: String,
    default: ""
  },
  twitterId: {
    type: String,
    default: ""
  },
  discordId: {
    type: String,
    default: ""
  },
  twitchId: {
    type: String,
    default: ""
  }
});

module.exports = User = mongoose.model("users", UserSchema);