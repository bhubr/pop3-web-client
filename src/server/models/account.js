import pool from '../db';
import bcrypt from 'bcrypt';
import Promise from 'bluebird';
import Pop3Command from 'node-pop3';
import chain from 'store-chain';
import { simpleParser } from 'mailparser';
import cheerio from 'cheerio';
import Message from './message';
import pop3SessionStore from './pop3SessionStore';

import { encrypt, decrypt } from '../utils';
// import {
//   listRemoteMessages,
//   fetchRemoteMessages
// } from '../Pop3Interface';

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
    this.port = props.port;
    this.host = props.host;
    this.identifier = props.identifier;
    this.password = props.password;

    this.fetchMessages = this.fetchMessages.bind(this);
    this.fetchMessage = this.fetchMessage.bind(this);
    this.pop3 = pop3SessionStore.get(this.id);
  }

  getPop3Credentials() {
    return {
      host: this.host,
      user: this.identifier,
      password: this.password,
      port: this.port
    };
  }

  static findAll() {
    return pool
      .query('select id, userId, type, host, port, identifier, password from accounts');
  }

  static findOne(id, userPass) {
    const doDecrypt = typeof userPass === 'string';

    const selectQuery = `select id, userId, type, host, port, identifier, password from accounts where id = ${id}`;
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
    const requiredKeys = ['userId', 'host', 'port', 'identifier', 'password', 'type'];
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

  isPop3SessionOpen() {
    return this.pop3 !== null;
  }

  openPop3Session() {
    this.pop3 = new Pop3Command(this.getPop3Credentials());
    pop3SessionStore.set(this.id, this.pop3);
  }

  closePop3Session() {
    return this.pop3.QUIT()
    .then(() => {
      this.pop3 = null;
      pop3SessionStore.unset(this.id);
      return true;
    });
  }

  listRemoteMessages() {
    if(! this.pop3) {
      this.openPop3Session();
    }
    return this.pop3.UIDL();
  }

  fetchMessages(idUidls) {
    console.log('\n\n##### Account.fetchMessages', idUidls)
    return Promise.reduce(idUidls, this.fetchMessage, []);
  }

  fetchRemoteMessages(account, start = 0, num = 10) {
    return chain(this.listRemoteMessages())
    .then(idUidls => idUidls.slice(start, num))
    .then(this.fetchMessages)
    // .then(passLog)
    // .set('messages')
    // .then(() => pop3.QUIT())
    // .get(({ messages }) => (messages));
  }

  fetchMessage(carry, msgIdUidl) {
    const [msgId, uidl] = msgIdUidl;
    return Message.findOneByUidl(uidl)
    .then(message => {
      if(message) {
        return message;
      }
      return new Promise((resolve, reject) => {
        this.pop3.RETR(msgId)
        .then(stream => simpleParser(stream,
          (err, mail) => {
            if (err) {
              return reject(err);
            }
            const { html, textAsHtml, subject, from } = mail;
            const [{ address, name }] = from.value;
            const theHtml = html ? html : textAsHtml;
            const $ = cheerio.load(theHtml);
            const body = $('body').html();

            // const style = $('style').html();
            resolve({
              accountId: this.id,
              uidl,
              senderName: name,
              senderEmail: address,
              subject,
              raw: JSON.stringify(mail),
              html: theHtml
            });
          })
        )
      })
      .then(props => Message.create(props))
      .then(message => carry.concat([message]));
    });
  }


}