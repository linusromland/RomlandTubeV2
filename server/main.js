const { session } = require("passport");

const express = require("express"),
    bodyParser = require("body-parser"),
    passportLocalMongoose = require("passport-local-mongoose"),
    passport = require("passport"),
    mongoose = require('mongoose'),
    expressSession = require('express-session'),
    app = express(),
    port = 3000,
    UserSchema = require("./models/UserSchema.js"),
    dBModule = require('./dbModule')


const clientDir = __dirname + "/client/";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(clientDir));

app.set("view engine", "ejs");

dBModule.cnctDB("RomlandTubev2")

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    console.log("New User Registration POST!");
    try {
      const userExist = await dBModule.findInDBOne(User, req.body.name);
      if (userExist == null) {
        const hashedPassword = req.body.password;
        dBModule.saveToDB(createUser(req.body.name, hashedPassword));
        res.cookie("usrName", req.body.name, {
          httpOnly: true,
          secure: true,
          sameSite: true,
          maxAge: 2147483647,
          domain: 'romland.space'
        });
        res.cookie("pswd", req.body.password, {
          httpOnly: true,
          secure: true,
          sameSite: true,
          maxAge: 2147483647,
          domain: 'romland.space'
        });
        res.redirect("/");
      } else {
        return res.status(400).send("taken");
      }
    } catch {
      res.status(500).send();
    }
  });


app.listen(port, () => console.log(`Server listening on port ${port}!`));
