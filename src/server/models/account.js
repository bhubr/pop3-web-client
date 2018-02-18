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

function passLog(label) {
  return v => {
    console.log('\n\n######\\\\\\#\n#', label, '\n', v);
    return v;
  }
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
    this.readEmailStream = this.readEmailStream.bind(this);
    this.parseEmail = this.parseEmail.bind(this);

    this.pop3 = pop3SessionStore.get(this.id);
    this.socketIOHandler = require('../socketIOHandler');
  }

  getPop3Credentials() {
    return {
      host: this.host,
      user: this.identifier,
      password: this.password,
      port: this.port
    };
  }

  static findAll(whereHash) {
    whereHash = whereHash || {};
    const baseQuery = 'select id, userId, type, host, port, identifier, password from accounts';
    let whereStrings = [];
    for(let k in whereHash) {
      whereStrings.push(k + '=' + trimAndQuote(whereHash[k]));
    }
    const whereCondition = whereStrings.length ? ' WHERE ' + whereStrings.join(' AND ') : '';
    console.log('Account.findAll', baseQuery + whereCondition);
    return pool
      .query(baseQuery + whereCondition);
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
    console.log('\n\n\n#### openPop3Session', this.getPop3Credentials());
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

  fetchRemoteMessages(start = 0, num = 0) {

    return chain(this.listRemoteMessages())
    .then(passLog('returned by listRemoteMessages'))
    .then(idUidls => (
      num ? idUidls.slice(start, num) : idUidls
    ))
    // .then(passLog('after optional slice'))
    .then(this.socketIOHandler.onMessageListSuccess(this.userId))
    .then(this.fetchMessages)
    // .then(passLog('fetchMessages returned'))
    // .set('messages')
    // .then(() => pop3.QUIT())
    // .get(({ messages }) => (messages));
  }

  readEmailStream(stream) {
    // console.log('#### readEmailStream', stream);
    return new Promise((resolve, reject) => {
      let data = '';
      let buffers = [];
      let len = 0;
      stream.on('data', (chunk) => {
        // console.log('### readEmailStream data', chunk, chunk.length);
        data += chunk.toString();
        buffers.push(chunk);
        len += chunk.length;
      });
      stream.on('end', (chunk) => {
        // console.log('Account.readEmailStream', len, data);
        resolve({ buffer: Buffer.concat(buffers), len, data });
      });
    });
  }

  parseEmail(uidl) {
    return streamAndData => {
      const { buffer, len, data } = streamAndData;
      // console.log('parseEmail', buffer, len, data);
      return new Promise((resolve, reject) =>
        simpleParser(buffer,
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
            subject: subject || '',
            raw: JSON.stringify(mail),
            html: theHtml,
            body
          });
        })
      );
    }
  }

  extractBaseProps(message) {
    const { uidl, subject, senderName, senderEmail } = message;
    return { uidl, subject, senderName, senderEmail };
  }

  fetchMessage(carry, msgIdUidl) {
    console.log('##### fetchMessage', msgIdUidl);

    const [msgId, uidl] = msgIdUidl;
    return Message.findOneByUidl(uidl)
    .then(message => {

      // BYPASS DB

      if(message) {
        return message;
      }
      return this.pop3.RETR(msgId)
      .then(passLog('\n\nfetchMessage #1 stream'))
      .then(this.readEmailStream)
      .then(this.parseEmail(uidl))
      .then(passLog('\n\nfetchMessage #2 parsed'))
      .then(props => Message.create(props))
      // .catch(this.socketIOHandler.onMessageFetchError(this.userId)
        // .then(() => (carry))
      .catch(err => {
        console.error(err);
        return carry;
      });
    })
    .then(this.extractBaseProps)
    .then(this.socketIOHandler.onMessageFetchSuccess(this.userId))
    .then(message => carry.concat([message]));
  }


}