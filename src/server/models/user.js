import pool from '../db';
import bcrypt from 'bcrypt';
import Promise from 'bluebird';

const hashAsync = Promise.promisify(bcrypt.hash);
const SALT_ROUNDS = 10;

function trimAndQuote(v) {
  return typeof v === 'string' ?
    "'" + v.trim() + "'" : v;
}

function passLog(v) {
  console.log(v); return v;
}

export default class User {

  static hashPassword(password) {
    return hashAsync(password, SALT_ROUNDS);
  }

  static readAll() {
    return pool
      .query('select `id`, `email` from users');
  }

  static beforeCreate(user) {
    return User.hashPassword(user.password)
      .then(password => Object.assign(user, {
        password
      }));
  }

  static create(user) {
    const requiredKeys = ['email', 'password'];
    const optionalKeys = ['first_name', 'last_name'];
    for(let i = 0 ; i < requiredKeys.length ; i++) {
      const k = requiredKeys[i];
      if(! user[k]) {
        return Promise.reject(new Error(`required key '${k}' is missing`));
      }
    }
    for(let k in user) {
      if(requiredKeys.indexOf(k) === -1 && optionalKeys.indexOf(k) === -1) {
        return Promise.reject(new Error(`unexpected key '${k}'`));
      }
    }

    return User.beforeCreate(user)
      .then(user => {
        const fields = Object.keys(user).join(',');
        const values = Object.values(user).map(trimAndQuote).join(',');
        const insertQuery = `insert into users(${fields}) values(${values})`;
        let selectQuery = "select `id`, `email` from users where id = ";
        return pool
          .query(insertQuery)
          .then(result => pool.query(selectQuery + result.insertId))
          .then(records => (records[0]));
      })
  }

  static delete(id) {
    const deleteQuery = 'delete from users where id = ' + id;
    return pool
      .query(deleteQuery);
  }

}