const pool = require('../db');

const User = {

  readAll: function() {
    return  pool
      .query('select `id`, `email` from users');
  },

  create: function(email) {
    const insertQuery = "insert into users(email) values('" + email.trim() + "')";
    let selectQuery = "select `id`, `email` from users where id = ";
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
