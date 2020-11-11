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
  dBModule = require('./dbModule'),
  cookieParser = require("cookie-parser"),
  eescape = require("escape-html")


const clientDir = __dirname + "/client/";

//creates the User
const User = mongoose.model("User", UserSchema);

/*Enables JSON, Cookies, extended for express and 
creates a static path for CSS etc */
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(clientDir));

//Enables EJS
app.set("view engine", "ejs");

//Connect to Mongo
dBModule.cnctDBAuth("RomlandTube")

// GET ROUTES

app.get("/", (req, res) => {
  let name = "Not Logged in"
  let loggedin = false
  if (req.cookies.usrName && logIn(req.cookies.usrName, req.cookies.pswd)) {
    name = req.cookies.usrName
    loggedin = true
  }
  res.render("index", {
    name: name,
    loggedIn: loggedin,
    eescape: eescape
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/logout", (req, res) => {
  res.clearCookie("usrName");
  res.clearCookie("pswd");
  res.redirect("/");
});

// POST ROUTES

app.post("/register", async (req, res) => {
  console.log("New User Registration POST!");
  try {
    const userExist = await dBModule.findInDBOne(User, req.body.name);
    if (userExist == null) {
      dBModule.saveToDB(createUser(req.body.name, req.body.password));
      giveCookies(req, res)
      res.status(201).send();
    } else {
      return res.status(400).send("taken");
    }
  } catch {
    res.status(500).send();
  }
});

app.post("/login", async (req, res) => {
  try {
    if (await logIn(req.body.name, req.body.password)) {
      giveCookies(req, res)
      res.status(200).send()
    } else {
      res.status(401).send();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

app.post("/authUser", async (req, res) => {
  if (await logIn(req.cookie.usrName, req.cookie.pswd)) {
    res.send("true")
  } else {
    res.send("false")
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

async function logIn(username, password) {
  const user = await dBModule.findInDBOne(User, username);
  if (user == null) {
    return false;
  }
  if (password == user.password) {
    return true;
  } else {
    return false;
  }
}

function giveCookies(req, res) {
  res.cookie("usrName", req.body.name, {
    httpOnly: true,
    secure: true,
    sameSite: true,
    maxAge: 2147483647,
    //domain: 'romland.space'
  });
  res.cookie("pswd", req.body.password, {
    httpOnly: true,
    secure: true,
    sameSite: true,
    maxAge: 2147483647,
    //domain: 'romland.space'
  });
}