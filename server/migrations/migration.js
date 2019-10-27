
// Bring Mongoose into the app
var mongoose = require('mongoose')
mongoose.set('debug', true)
// import the user model
const user = require('../models/user.model').users
// import user data
const users = require('./user/data.js').users
// Build the connection string
// var dbURI = 'mongodb://rholab:rholab123@ds125912.mlab.com:25912/scrape-app'
var dbURI = 'mongodb://localhost:27017/scrape-app'

mongoose.Promise = global.Promise
// Create the database connection
mongoose.connect(dbURI, { useNewUrlParser: true })

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + dbURI)
  user.remove({}, (err) => {
    if (err) {
      console.log(err)
      mongoose.connection.close(function () {
        console.log('Disconnecting Mongoose default connection')
        process.exit(1)
      })
    }
    user.create(users[0]).then((newUser) => {
      newUser.password = newUser.generateHash(users[0].password)
      return newUser.save()
    }).then(() => {
      console.log('Admin user successfully saved')
      user.create(users[1]).then((userTwo) => {
        userTwo.password = userTwo.generateHash(users[1].password)
        return userTwo.save()
      }).then(() => {
        console.log('Normal user successfully saved')
        mongoose.connection.close(function () {
          console.log('Disconnecting Mongoose default connection')
          process.exit(1)
        })
      })
    })
  })
})

// If the connection throws an error
mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err)
})

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected')
})

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination')
    process.exit(0)
  })
})
