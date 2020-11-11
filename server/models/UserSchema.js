const mongoose = require('mongoose');

//Creates the UserSchema and exports it
const UserSchema  = new mongoose.Schema({
  name :{
      type  : String,
      required : true
  } ,
password :{
    type  : String,
    required : true
} ,
date :{
    type : Date,
    default : Date.now
}
});

module.exports = UserSchema;