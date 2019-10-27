/*
 Requires
*/

var mongoose = require('mongoose')
var Schema = mongoose.Schema

/*
 Schema
*/
var listsModel = Schema({
 /*  name: {
    type: String,
    required: true,
    trim: true
  }, */
  user: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }],
  isTicketed: Boolean,
  list: {
    brand: String,
    category: String,
    description: String,
    image: String,
    name: String,
    price: String,
    site: String,
    uri: String,
    matchDetails: Object,
    matchPercentage: Number,
    show: Boolean,
    searchTerm: String,
    searchTerms: Object
  }
})

/*
 Export Schema
*/

const lists = mongoose.model('lists', listsModel)
module.exports.lists = lists
