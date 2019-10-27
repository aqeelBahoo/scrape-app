'use strict'

const search = require('./search')
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const user = require('./server/routes/user.route')
const list =  require('./server/routes/list.route')
const passport = require('passport')
require('./server/db/db')
require('./server/config/passport')(passport)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(passport.initialize())

app.use('/api/user', user)
app.use('/api/list', list)

app.post('/api/search/daraz', (req, res) => {
  console.log('--------------daraz-------------');
  let searchTerm = req.body.searchTerm
  let category = req.body.category
  let searchTerms = req.body.searchTerms
  search.getDarazProductsInfo(searchTerm, category, searchTerms)
    .then((products) => {
      if(products.length) {
        res.json(products)
      } else {
        res.json([])
      }
    })
    .catch((e) => {
      res.json([])
      console.error('Error: ', e)
    })
})

app.post('/api/search/yayvo', (req, res) => {
  console.log('--------------daraz-------------');
  let searchTerm = req.body.searchTerm
  let category = req.body.category
  let searchTerms = req.body.searchTerms
  search.getYayvoProductsInfo(searchTerm, category, searchTerms)
    .then((products) => {
      if(products.length) {
        res.json(products)
      } else {
        res.json([])
      }
      
    })
    .catch((e) => {
      res.json([])
      console.error('Error: ', e)
    })
})

app.post('/api/search/qne', (req, res) => {
  console.log('---------------QNE----------------');
  let searchTerm = req.body.searchTerm
  let category = req.body.category
  let searchTerms = req.body.searchTerms
  search.getQneProductsInfo(searchTerm, category, searchTerms)
    .then((products) => {
      if(products.length) {
        res.json(products)
      } else {
        res.json([])
      }
    })
    .catch((e) => {
      res.json([])
      console.error('Error: ', e)
    })
})

app.post('/api/search/mycart', (req, res) => {
  console.log('------------mycart-------------');
  let searchTerm = req.body.searchTerm
  let category = req.body.category
  let searchTerms = req.body.searchTerms 

  search.getMyCartProductsInfo(searchTerm, category, searchTerms)
    .then((products) => {
      if(products.length) {
        res.json(products)
      } else {
        res.json([])
      }
    })
    .catch((e) => {
      res.json([])
      console.error('Error: ', e)
    })
})

app.post('/api/search/hummart', (req, res) => {
  console.log('------------hummart-------------');
  let searchTerm = req.body.searchTerm
  let category = req.body.category
  let searchTerms = req.body.searchTerms 

  search.getHummartProductsInfo(searchTerm, category, searchTerms)
    .then((products) => {
      if(products.length) {
        res.json(products)
      } else {
        res.json([])
      }
    })
    .catch((e) => {
      res.json([])
      console.error('Error: ', e)
    })
})
app.post('/api/search/tazamart', (req, res) => {
  console.log('------------tazmart-------------');
  let searchTerm = req.body.searchTerm
  let category = req.body.category
  let searchTerms = req.body.searchTerms 

  search.getTazaMartProductsInfo(searchTerm, category, searchTerms)
    .then((products) => {
      if(products.length) {
        res.json(products)
      } else {
        res.json([])
      }
    })
    .catch((e) => {
      res.json([])
      console.error('Error: ', e)
    })
})

app.listen(3333)
console.log('Listening on localhost:3333')
