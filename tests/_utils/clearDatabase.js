const pool = require('../../dist/db');

module.exports = () => pool.query('delete from messages')
  .then(() => pool.query('alter table messages AUTO_INCREMENT = 1'))
  .then(() => pool.query('delete from accounts'))
  .then(() => pool.query('alter table accounts AUTO_INCREMENT = 1'))
  .then(() => pool.query('delete from userProfiles'))
  .then(() => pool.query('alter table userProfiles AUTO_INCREMENT = 1'))
  .then(() => pool.query('delete from users'))
  .then(() => pool.query('alter table users AUTO_INCREMENT = 1'));