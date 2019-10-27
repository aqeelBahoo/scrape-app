// Models
const lists = require('../models/list.model').lists

module.exports = {

  getLists: () => {
    return lists.find({}).exec()
  },

  getListsByUser: (userID) => {
    const query = { user: userID }
    return lists.find(query).exec()
  },

  getListByID: (id) => {
    console.log('** id : ', id )
    return lists.findById(id).populate('user').exec()
  },

  save: (list) => {
    return lists.create(list)
  },

  remove: (id) => {
    return lists.findByIdAndRemove(id).exec()
  },

  update: (id, list) => {
    return lists.findByIdAndUpdate(id, { list }).exec()
  },

  refreshItem: (id) => {
    lists.findById(id).exec().then(
      
    )
  }

}
