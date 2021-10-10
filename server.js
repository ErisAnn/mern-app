require('dotenv').config(); // loads the variables into the environment

const express = require("express"); // req express.js
const cors = require("cors"); // req cors.js
const passport = require("passport");
const userRoute = require("./routes/api/users");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const connectToDB = require('./app/dbConnection.js');
const app = express(); // create new express app

// Middleware
app.use(cors({
  origin: `${process.env.SELF}:${process.env.PORT}`,
  optionsSuccessStatus: 200
  })
);

// DB Config
connectToDB();

// Need these middleware methods from express for POST and PUT requests (no more body-parser):
app.use(express.json()); // recognize and parse requests of type application/json
app.use(express.urlencoded({ extended: true })); // recognize and parse request type x-www-form-urlencoded
app.use(cookieParser());

// Passport middleware
app.use(session({
  secret: "secret",
  name: "cookie_name",
  //store: sessionStore, mongo session store
  proxy: true,
  resave: true,
  saveUninitialized: true
}));

// Passport config
require("./config/passport")(passport);
require('./config/passport-google')(passport);
require('./config/passport-twitter')(passport);
require('./config/passport-discord')(passport);
require('./config/passport-twitch')(passport);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

// Server homepage route
app.get("/", (req, res) => {
  res.send('Hi!'); // res.json({ message: 'hi!!' });
});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) { console.log('testing!');
    res.redirect('http://localhost:3000/dashboard');
  });

// Redirect the user to Twitter for authentication.  When complete, Twitter
// will redirect the user back to the application at
//   /auth/twitter/callback
app.get('/auth/twitter', passport.authenticate('twitter'));

// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/twitter/callback', passport.authenticate('twitter', { 
    successRedirect: 'http://localhost:3000/dashboard',
    failureRedirect: '/' }));

// Discord
app.get('/auth/discord', passport.authenticate('discord'));
app.get('/auth/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('http://localhost:3000/dashboard') // Successful auth
});

//Twitch
app.get("/auth/twitch", passport.authenticate('twitch'));
app.get("/auth/twitch/callback", passport.authenticate('twitch', {
    failureRedirect: '/'
}), (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("http://localhost:3000/dashboard")
});

// Routes
app.use("/api/users", userRoute); // routing - how app responds to client request (URI & HTTP request method)

const PORT = process.env.PORT || 5000; // use .env port or 5000
app.listen(PORT, () => {
  console.log(`Server is running at port ${process.env.PORT}.`);
});