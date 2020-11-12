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
  User = require("./models/User.js"),
  Video = require("./models/Video.js"),
  dBModule = require('./dbModule'),
  cookieParser = require("cookie-parser"),
  eescape = require("escape-html"),
  upload = require('express-fileupload'),
  mime = require('mime-types'),
  fs = require('fs')


const clientDir = __dirname + "/client/";



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
if(fs.existsSync("mongoauth.json")){
  dBModule.cnctDBAuth("RomlandTube")
}else{
  dBModule.cnctDB("RomlandTube")
}

// GET ROUTES

app.get("/", (req, res) => {
  let name = "Not Logged in"
  let loggedin = false
  if (req.cookies.usrName && logIn(req.cookies.usrName, req.cookies.pswd)) {
    name = req.cookies.usrName
    loggedin = true
  }
  fs.readdir(clientDir + "/themes", async function (err, files) {
    //handling error
    if (err) {
      return console.log('Unable to find or open the directory: ' + err);
    }

    res.render("index", {
      name: name,
      loggedIn: loggedin,
      videos: await getVids(),
      eescape: eescape,
      files: files
    });
  });
});

app.get("/login", async (req, res) => {
  if (await logIn(req.cookies.usrName, req.cookies.pswd)) {
    res.redirect("/")
  } else {

    fs.readdir(clientDir + "/themes", function (err, files) {
      //handling error
      if (err) {
        return console.log('Unable to find or open the directory: ' + err);
      }

      res.render("login", {
        loggedIn: false,
        files: files
      });
    });
  }
});

app.get("/view", async (req, res) => {
  let loggedIn = false
  let name = "Not Logged in"
  let id = req.query.id;
  if (await logIn(req.cookies.usrName, req.cookies.pswd)) {
    loggedIn = true
    name = req.cookies.usrName
  }

  fs.readdir(clientDir + "/themes", async function (err, files) {
    //handling error
    if (err) {
      return console.log('Unable to find or open the directory: ' + err);
    }
    let video = await getVideo(id)
    res.render("view", {
      loggedIn: loggedIn,
      name: name,
      files: files,
      vid: video,
      eescape: eescape,
    });
  });

});

app.get("/register", async (req, res) => {
  if (await logIn(req.cookies.usrName, req.cookies.pswd)) {
    res.redirect("/")
  } else {
    fs.readdir(clientDir + "/themes", function (err, files) {
      //handling error
      if (err) {
        return console.log('Unable to find or open the directory: ' + err);
      }

      res.render("register", {
        loggedIn: false,
        files: files
      });
    });
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("usrName");
  res.clearCookie("pswd");
  res.redirect("/");
});

app.get("/upload", async (req, res) => {
  if (await logIn(req.cookies.usrName, req.cookies.pswd)) {
    fs.readdir(clientDir + "/themes", function (err, files) {
      //handling error
      if (err) {
        return console.log('Unable to find or open the directory: ' + err);
      }

      res.render("upload", {
        name: req.cookies.usrName,
        loggedIn: true,
        eescape: eescape,
        files: files
      });
    });
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
      let videoData = file.video.data
      let thumbData = file.thumb.data


      if (checkFile(file.video, "video/", 100) && checkFile(file.thumb, "image/", 5)) {
        let videoExtention = mime.extension(file.video.mimetype)
        let thumbExtention = mime.extension(file.thumb.mimetype)

        let videoName = file.video.md5 + "." + videoExtention
        let videoPath = clientDir + "upload/videos/" + videoName
        let goodVideoPath = "upload/videos/" + videoName
        let thumbName = file.video.md5 + "." + thumbExtention
        let thumbPath = clientDir + "upload/thumbnails/" + thumbName
        let goodThumbPath = "upload/thumbnails/" + thumbName
        fs.writeFile(videoPath, videoData, function (err) {
          if (err) {
            return console.log(err)
          }
        })
        fs.writeFile(thumbPath, thumbData, function (err) {
          if (err) {
            return console.log(err)
          }
        })
        dBModule.saveToDB(createVideo(_req.body.name, _req.body.desc, goodVideoPath, goodThumbPath, file.video.mimetype , _req.cookies.usrName))
        _res.header('Content-Type', 'application/json');
        _res.status(200).send()
      } else {
        _res.status(401).send()
      }
    } else {
      _res.status(500).send()
    }

  } else {
    _res.status(500).send()
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

function createVideo(name, desc, link, thumbLink, mimein, channel) {
  name = name.substring(0, 25)
  desc = desc.substring(0, 150)

  let tmp = new Video({
    name: name,
    desc: desc,
    link: link,
    thumbLink: thumbLink,
    channel: channel,
    mime: mimein
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

async function getVids() {
  return await dBModule.findInDB(Video)
}

async function getVideo(id) {
  return await dBModule.findVideoWithID(Video, id)
}

function checkFile(file, wantedType, wantedSize) {
  let fileExtention = mime.extension(file.mimetype)
  return (file.size < wantedSize * (1000000) && fileExtention && file.mimetype.includes(wantedType))
}