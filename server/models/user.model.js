/*
 Requires
*/

var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')
var Schema = mongoose.Schema

/*
 Schema
*/

var usersModel = Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  admin: { type: Boolean, default: false }
})

// methods ======================
// generating a hash
usersModel.methods.generateHash = (password) => {
  return bcrypt.hashSync(password)
}

// checking if password is valid
usersModel.methods.validPassword = (password, actualPassword) => {
  if (actualPassword != null) {
    return bcrypt.compareSync(password, actualPassword)
  } else {
    return false
  }
}

/*
 Export Schema
*/

const users = mongoose.model('users', usersModel)
module.exports.users = users
