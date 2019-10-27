const express = require('express')
const router = express.Router()
const passport = require('passport')
const listService = require('../services/list.service')
const refreshService = require('../services/refresh')
const isAdmin = require('../middlewares/is-admin.middleware').isAdmin

// Models

router.get('/', passport.authenticate('jwt', { session: false }), isAdmin, (req, res, next) => {
  listService.getLists()
    .then((lists) => res.json({
      href: req.hostname,
      data: lists
    }))
    .catch(err => { throw err })
})

router.post('/', (req, res, next) => {
  const {
    user,
    list
  } = req.body
  const obj = { user, list}
  listService.save(obj)
    .then((list) => {
      res.json({ success: true })
    })
    .catch(err => {
        res.json({ success: false, error: err })
    })
})


router.get('/id/:ID', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  var listID = req.params.ID

  listService.getListByID(listID)
    .then((list) => res.json({
      href: req.hostname,
      data: list
    }))
    .catch(err => { throw err })
})

router.get('/user/:ID', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  var userID = req.params.ID

  listService.getListsByUser(userID)
    .then((lists) => res.json({
      href: req.hostname,
      data: lists
    }))
    .catch(err => { throw err })
})

router.delete('/:ID', (req, res, next) => {
  const listID = req.params.ID
  listService.remove(listID)
    .then((list) => {
      res.json({ success: true, list })
    })
    .catch(err => {
        res.json({ success: false, error: err })
    })
})

router.put('/:ID', (req, res, next) => {
  const listID = req.params.ID
  const list = req.body.list
  listService.update(listID, list)
    .then((list) => {
      res.json({ success: true, list })
    })
    .catch(err => {
        res.json({ success: false, error: err })
    })
})

router.post('/refresh-item/:id', (req, res, next) => {
  const listID = req.params.id
  listService.getListByID(listID)
    .then(async (list) => {
      console.log('*** list received : ', list)
      await refreshService.refreshItem(list)
      res.json({ success: true, list })
    })
    .catch(err => {
      console.log('*** error',  err)
        res.json({ success: false, error: err })
    })
})

module.exports = router
