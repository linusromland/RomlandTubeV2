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
  VideoSchema = require("./models/VideoSchema.js"),
  dBModule = require('./dbModule'),
  cookieParser = require("cookie-parser"),
  eescape = require("escape-html"),
  upload = require('express-fileupload'),
  mime = require('mime-types'),
  fs = require('fs')


const clientDir = __dirname + "/client/";

//Creates the User and Video Object
const User = mongoose.model("User", UserSchema);
const Video = mongoose.model("Video", VideoSchema);

/*Enables JSON, Cookies, extended for express and 
creates a static path for CSS etc */
app.use(express.json());
app.use(cookieParser());
app.use(upload());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(clientDir));
app.use(bodyParser.urlencoded({
  extended: true
}));


//Enables EJS
app.set("view engine", "ejs");

//Connect to Mongo
dBModule.cnctDB("RomlandTube")

// GET ROUTES

app.get("/", (req, res) => {
  let name = "Not Logged in"
  let loggedin = false
  if (req.cookies.usrName && logIn(req.cookies.usrName, req.cookies.pswd)) {
    name = req.cookies.usrName
    loggedin = true
  }
  fs.readdir(clientDir + "/themes", function (err, files) {
    //handling error
    if (err) {
      return console.log('Unable to find or open the directory: ' + err);
    }

    res.render("index", {
      name: name,
      loggedIn: loggedin,
      videos: getVids(),
      eescape: eescape,
      files: files
    });
  });
});

app.get("/login", async (req, res) => {
  if (await logIn(req.cookies.usrName, req.cookies.pswd)) {
    res.redirect("/")
  } else {
    res.render("login");
  }
});

app.get("/register", async (req, res) => {
  if (await logIn(req.cookies.usrName, req.cookies.pswd)) {
    res.redirect("/")
  } else {
    res.render("register");
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("usrName");
  res.clearCookie("pswd");
  res.redirect("/");
});

app.get("/upload", async (req, res) => {
  if (await logIn(req.cookies.usrName, req.cookies.pswd)) {
    res.render("upload")
  } else {
    res.redirect("/")
  }
})

//if page does not exist, redirect to /
app.get('*', function (req, res) {
  res.redirect('/');
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

app.post('/upload', async (_req, _res) => {
  if (await logIn(_req.cookies.usrName, _req.cookies.pswd)) {
    if (_req.files) {
      let file = _req.files
      let filename = file.theFile.name
      let filedata = file.theFile.data
      let fileExtention = mime.extension(file.theFile.mimetype)

      if (file.theFile.size < 100 * (1000000) && !(fileExtention == false) && file.theFile.mimetype.includes("video/")) {
        let fileName = file.theFile.md5 + "." + fileExtention
        let filepath = clientDir + "/upload/" + fileName
        fs.writeFile(filepath, filedata, function (err) {
          if (err) {
            return console.log(err)
          }
          dBModule.saveToDB(createVideo(_req.body.name, _req.body.desc, `/upload/${fileName}`, _req.cookies.usrName))
          _res.header('Content-Type', 'application/json');
          /*_res.header("Access-Control-Allow-Headers", "*")
          _res.header("Access-Control-Allow-Origin", "*")*/

          _res.send(`{ \"upload\": \"successful\", \"link\": \"/upload/${fileName}\"}`)
        })
      } else {
        _res.send("{ \"upload\": \"failed\" }")
      }

    } else {
      _res.status(500)
    }
  } else {
    _res.status(500)
  }
})


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

function createVideo(name, desc, link, channel) {
  let tmp = new Video({
    name: name,
    desc: desc,
    link: link,
    channel: channel,
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

function getVids(){
  return "cool"
  
}