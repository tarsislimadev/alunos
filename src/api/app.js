const express = require('express')
const cors = require('cors')

const app = express()

// Somethings
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// use CORS (npm i --save cors)
app.use(cors({ origin: '*', methods: 'OPTIONS, HEAD, GET, POST' }))

app.use(function (req, res, next) {
  if (req.url !== '/login') { console.log(req.url, req.body) }
  next()
})

// That are the routes
app.use('/', require('./routes'))

// Here is the Error Handler
app.use('/*', function (req, res) {
  res.status(404)
  res.json({ success: false, message: 'Nada por aqui :(' })
})

// And finally...
module.exports = app
