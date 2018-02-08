const mysql = require('promise-mysql');
const configFile = process.env.NODE_ENV !== 'test' ? 'config' : 'config.test'
const config = require('../' + configFile);

module.exports = mysql.createPool(Object.assign({
  connectionLimit: 10
}, config.db.connection));
