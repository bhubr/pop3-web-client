const pool = require('../db');

const User = {

  readAll: function() {
    return  pool
      .query('select `id`, `name` from users');
  },

  create: function(name) {
    const insertQuery = "insert into users(name) values('" + name.trim() + "')";
    let selectQuery = "select `id`, `name` from users where id = ";
    return pool
      .query(insertQuery)
      .then(result => pool.query(selectQuery + result.insertId))
      .then(records => (records[0]));
  },

  delete: function(id) {
    const deleteQuery = 'delete from users where id = ' + id;
    return pool
      .query(deleteQuery);
  }
};

module.exports = User;
