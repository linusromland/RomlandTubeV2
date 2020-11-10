const mongoose = require('mongoose');
const mongAuth = require('./mongoauth.json')
let db;

exports.cnctDBAuth = (collectionname) =>{
  mongoose.connect(
    "mongodb://localhost:27017/" + collectionname,
    {
      "auth": {
        "authSource": "admin"
      },
      "user": mongAuth.username,
      "pass": mongAuth.pass
    }
  );

  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
    console.log("logged in to " + collectionname)
});

}

exports.cnctDB = (collectionname) =>{
    let dbLink = `mongodb://localhost/${collectionname}`
    mongoose.connect(dbLink, { useNewUrlParser: true, useUnifiedTopology: true });
  
    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
      console.log("logged in to " + collectionname)
  });
  
  }

exports.saveToDB = (input) => {
    input.save(()=>{
      console.log(`Successfully saved ${input} to the database!`)
    })
}