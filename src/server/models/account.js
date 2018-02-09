import pool from '../db';
import bcrypt from 'bcrypt';
import Promise from 'bluebird';

const hashAsync = Promise.promisify(bcrypt.hash);
const compareAsync = Promise.promisify(bcrypt.compare);
const SALT_ROUNDS = 10;

function trimAndQuote(v) {
  return typeof v === 'string' ?
    "'" + v.trim() + "'" : v;
}

function passLog(v) {
  console.log(v); return v;
}

export default class Account {

  static findAll() {
    return pool
      .query('select id, userId, host, identifier, password from accounts');
  }

  static findOne(id) {
    const selectQuery = `select id, userId, host, identifier, password from accounts where id = ${id}`;
    return pool.query(selectQuery)
      .then(records => (records[0]));
  }

  static create(account) {
    const requiredKeys = ['userId', 'host', 'identifier', 'password'];
    for(let i = 0 ; i < requiredKeys.length ; i++) {
      const k = requiredKeys[i];
      if(! account[k]) {
        return Promise.reject(new Error(`required key '${k}' is missing`));
      }
    }
    for(let k in account) {
      if(requiredKeys.indexOf(k) === -1) {
        return Promise.reject(new Error(`unexpected key '${k}'`));
      }
    }

    const fields = Object.keys(account).join(',');
    const values = Object.values(account).map(trimAndQuote).join(',');
    const insertQuery = `insert into accounts(${fields}) values(${values})`;
    return pool
      .query(insertQuery)
      .then(result => Account.findOne(result.insertId));
  }

  static delete(id) {
    const deleteQuery = 'delete from accounts where id = ' + id;
    return pool
      .query(deleteQuery);
  }

}