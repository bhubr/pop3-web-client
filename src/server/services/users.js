const knex    = require('knex');
const service = require('feathers-knex');
const config  = require('../config');
const db = knex(config.db);

// Create the schema
db.schema.createTable('users', table => {
  table.increments('id');
  table.string('email');
});

module.exports = service({
  Model: db,
  autoload: true,
  name: 'users'
});
