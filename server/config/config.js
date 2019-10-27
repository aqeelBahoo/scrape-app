var convict = require('convict')

var config = convict({
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 80,
    env: 'PORT'
  },
  database: {
    host: {
      default: 'mongodb://localhost/ng-pakistan',
      env: 'DB_HOST'
    }
  }
})

config.validate()

module.exports = config
