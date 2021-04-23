const mysql = require('mysql')
const { MYSQL_CONF } = require('../config/database')

const con = mysql.createConnection(MYSQL_CONF)

con.connect()

function exec(sql) {
  const promise = new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) {
        reject(err)
        return
      }
      resolve(result)
    })
  }).catch(err => {
    console.log('error', err)
  })
  return promise
}

module.exports = {
  exec
}