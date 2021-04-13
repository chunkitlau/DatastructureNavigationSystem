const env = process.env.NODE_ENV

let MYSQL_CONF = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: '3306',
  database: 'mytravelsystem'
}

if (env === 'dev') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: '3306',
    database: 'mytravelsystem'
  }
}
if (env === 'production') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: '3306',
    database: 'mytravelsystem'
  }
}

module.exports = {
  MYSQL_CONF
}
