//Ipmports depedencies and others files
const { session } = require("passport"),
    express = require("express"),
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

//creates the User
const User = mongoose.model("User", UserSchema);

/*Enables JSON, extended for express and 
creates a static path for CSS etc */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(clientDir));

//Enables EJS
app.set("view engine", "ejs");

//Connect to Mongo
dBModule.cnctDB("RomlandTube")

// GET ROUTES

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

// POST ROUTES

app.post("/register", async (req, res) => {
    console.log("New User Registration POST!");
    try {
      const userExist = await dBModule.findInDBOne(User, req.body.name);
      if (userExist == null) {
        dBModule.saveToDB(createUser(req.body.name, req.body.password));
        res.status(200).send();
      } else {
        return res.status(400).send("taken");
      }
    } catch {
      res.status(500).send();
    }
  });


//Starts the HTTP Server on port 3000
app.listen(port, () => console.log(`Server listening on port ${port}!`));


// FUNCTIONS
function createUser(nameIN, passIN) {
  let tmp = new User({
    name: nameIN,
    password: passIN,
  });
  return tmp;
}