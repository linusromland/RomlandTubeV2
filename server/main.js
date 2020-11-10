const express = require("express"),
    bodyParser = require("body-parser"),
    passportLocalMongoose = require("passport-local-mongoose"),
    mongoose = require('mongoose'),
    app = express(),
    port = 3000,
    UserSchema = require("./models/UserSchema.js")

    
const clientDir = __dirname + "/client/";
UserSchema.plugin(passportLocalMongoose)
const User = mongoose.model('User',UserSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(clientDir));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));
