const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')
const userService = require('../services/user.service')
const secret = process.env.SECRET || 'tasmanianDevil'
const isAdmin = require('../middlewares/is-admin.middleware').isAdmin

// Models

router.get('/', passport.authenticate('jwt', { session: false }), isAdmin, (req, res, next) => {

  userService.getUsers()
    .then((users) => res.json({
      href: req.hostname,
      data: users
    }))
    .catch(err => { throw err })
})

router.get('/id/:ID', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  var userID = req.params.ID

  userService.getUser(userID)
    .then((user) => res.json({
      href: req.hostname,
      data: user
    }))
    .catch(err => { throw err })
})

router.delete('/id/:ID', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const userID = req.params.ID
  userService.deleteUser(userID)
    .then((user) => res.json({ success: true })
    )
    .catch(err => { throw err })
})

router.post('/', (req, res, next) => {
  const {
    name,
    email,
    password
  } = req.body
  const user = { name, email, password }
  userService.save(user)
    .then(() => {
      res.json({ success: true })
    })
    .catch(err => {
      if (err) {
        res.json({ success: false, error: err })
      }
    })
})

router.post('/login', (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  userService.login(email)
    .then(user => {
      if (!user) {
        console.log('** I am here')
        res.json({ error: 'Invalid username or password.' })
      } else {
        console.log('**** password : ', password)
        console.log('**** user.password : ', user.password);
        if (user.validPassword(password, user.password)) {
          var payload = { id: user.id, name: user.name }
          if (user.admin) {
            payload.admin = true
          }
          var token = jwt.sign(payload, secret, { expiresIn: '7d' })
          res.json({ success: true, token: 'bearer ' + token })
        } else {
          res.json({ error: 'Invalid username or password.' })
        }
      }
    })
    .catch(err => res.json({ error: err }))
})

router.post('/refresh-item/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const userID = req.params.ID
  userService.deleteUser(userID)
    .then((user) => res.json({ success: true })
    )
    .catch(err => { throw err })
})

router.post('/logout', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.sendStatus(200)
})

module.exports = router
