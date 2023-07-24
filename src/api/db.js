const mysql = require('mysql')
require('dotenv').config()

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
  connectTimeout: 60 * 1000 // 60 segundos
}

let conn = mysql.createConnection(config)

function onError () {
  conn.on('error', function (err) {
    console.error(err)
    conn = mysql.createConnection(config)
    onError()
  })
}

onError()

exports.conn = () => conn

exports.q = function (text = '', params = {}) {
  return Object.keys(params).reduce(
    (old, cur) => old.replace(':' + cur + ':', () => '"' + params[cur] + '"'),
    text
  )
}
