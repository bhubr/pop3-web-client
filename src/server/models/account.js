import pool from '../db';
import bcrypt from 'bcrypt';
import Promise from 'bluebird';
import { encrypt, decrypt } from '../utils';
import {
  listRemoteMessages,
  fetchRemoteMessages
} from '../Pop3Interface';

function trimAndQuote(v) {
  return typeof v === 'string' ?
    "'" + v.trim() + "'" : v;
}

function passLog(v) {
  console.log(v); return v;
}

export default class Account {

  constructor(props) {
    this.id = props.id;
    this.userId = props.userId;
    this.type = props.type;
    this.host = props.host;
    this.identifier = props.identifier;
    this.password = props.password;
  }

  getPop3Credentials() {
    return {
      host: this.host,
      user: this.identifier,
      password: this.password
    };
  }

  static findAll() {
    return pool
      .query('select id, userId, type, host, identifier, password from accounts');
  }

  static findOne(id, userPass) {
    const doDecrypt = typeof userPass === 'string';

    const selectQuery = `select id, userId, type, host, identifier, password from accounts where id = ${id}`;
    return pool.query(selectQuery)
      .then(records => (records[0]))
      .then(account => (! doDecrypt ? account : Object.assign(account, {
        password: decrypt(account.password, userPass)
      })))
      .then(props => new Account(props));
  }

  static beforeCreate(account, userPass) {
    const password = encrypt(account.password, userPass);
    return Promise.resolve(Object.assign(account, { password }));
  }

  static create(account, userPass) {
    const requiredKeys = ['userId', 'host', 'identifier', 'password', 'type'];
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
    if(typeof userPass !== 'string') {
      return Promise.reject(new Error(`required 2nd arg userPass is missing`));
    }

    return Account.beforeCreate(account, userPass)
    .then(account => {
      const fields = Object.keys(account).join(',');
      const values = Object.values(account).map(trimAndQuote).join(',');
      const insertQuery = `insert into accounts(${fields}) values(${values})`;
      return pool
        .query(insertQuery)
        .then(result => Account.findOne(result.insertId))
        .then(props => new Account(props));
    });
  }

  static delete(id) {
    const deleteQuery = 'delete from accounts where id = ' + id;
    return pool
      .query(deleteQuery);
  }

  listRemoteMessages() {
    return listRemoteMessages(this.getPop3Credentials());
  }

  fetchRemoteMessages() {
    return fetchRemoteMessages(this);
  }

}