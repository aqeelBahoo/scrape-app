
// Bring Mongoose into the app
var mongoose = require('mongoose')
mongoose.set('debug', true)
// import the user model
const user = require('../../models/user.model').users
// Build the connection string
// var dbURI = 'mongodb://rholab:rholab123@ds125912.mlab.com:25912/scrape-app'
var dbURI = 'mongodb://localhost:27017/scrape-app'

// Create the database connection
mongoose.connect(dbURI)

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + dbURI)

  user.remove({}, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Users successfully removed. Rollback Successful.')
    }
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
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0)
  })
})
