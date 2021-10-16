require('dotenv').config(); // loads the variables into the environment

const express = require("express"); // req express.js
const cors = require("cors"); // req cors.js
const passport = require("passport");
const userRoute = require("./routes/api/users");
const cookieParser = require("cookie-parser");
//const session = require("express-session");
const jwt = require("jsonwebtoken");
const keys = require("./config/keys");

const connectToDB = require('./app/dbConnection.js');
const User = require('./models/User');
const app = express(); // create new express app

/* TESTING
authRoute = require("./routes/authRoute"),
postRoute = require("./routes/postRoute"),
auth = require('./middleware/auth.js')(),
localStrategy = require("passport-local"),
app.use(auth.initialize());
// Passport Config
app.use(authRoute);
app.use(postRoute);
//
//
// END TESTING */

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

/* Am I even using this?
app.use(session({
  secret: "secret",
  name: "cookie_name",
  //store: sessionStore,
  proxy: true,
  resave: true,
  saveUninitialized: true
}));
*/

// Passport config
require("./config/passport")(passport);
require('./config/passport-google')(passport);
require('./config/passport-twitter')(passport);
require('./config/passport-discord')(passport);
require('./config/passport-twitch')(passport);

app.use(passport.initialize());
//app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(e => {
      done(new Error("Failed to deserialize an user"));
    });
});

// Server homepage route
app.get("/", (req, res) => {
  res.send('Hi!'); // res.json({ message: 'hi!!' });
});

// Google
app.get('/auth/google', passport.authenticate('google', {session: false, scope: ['https://www.googleapis.com/auth/plus.login']}));
app.get('/auth/google/callback', 
  passport.authenticate('google', {session: false, failureRedirect: '/'}),
  (req, res) => { 

    console.log('redirected', req.user)
    let user = {
        googleId: req.user.googleId
    }
    console.log(user)

    let token = jwt.sign({
        data: user
        }, 'secret', { expiresIn: 31556926 }
    );
    res.cookie('jwt', token)
    res.redirect('http://localhost:3000/cookietosession');

  });

// Twitter
app.get('/auth/twitter', passport.authenticate('twitter', {session: false}));
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { 
    session: false,
    successRedirect: 'http://localhost:3000/dashboard',
    failureRedirect: '/' }));

// Discord
app.get('/auth/discord', passport.authenticate('discord', {session: false}));
app.get('/auth/discord/callback', passport.authenticate('discord',
    {session: false,
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('http://localhost:3000/dashboard') // Successful auth
});

//Twitch
app.get("/auth/twitch", passport.authenticate('twitch', {session: false}));
app.get("/auth/twitch/callback", passport.authenticate('twitch', {session: false,
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