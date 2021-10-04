const mongoose = require("mongoose"); // req mongoose.js

async function connectToDatabase() {
    const db_uri = process.env.DB_URI // Get the variable from the environment

    mongoose.connect(db_uri) // connect to the database!!
        .catch(error => handleError(error));
    // or instead of db_uri use default port mongoose.connect('mongodb://localhost:27017/myapp');

    const db = mongoose.connection; // access default connection - "listen"
    db.on("error", console.error.bind(console, "connection error: ")); // every time an "error" happens
    db.once("open", function () {
    console.log("Connected successfully");
    }); // print to console on initial "open" connection "once"
    db.on('disconnected', function () {
        console.log('Mongoose connection disconnected');
    });
}

module.exports = connectToDatabase;