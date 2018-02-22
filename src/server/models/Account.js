import pool from '../db';
import bcrypt from 'bcrypt';
import Promise from 'bluebird';
import Pop3Command from 'node-pop3';
import chain from 'store-chain';
import { simpleParser } from 'mailparser';
import cheerio from 'cheerio';
import Model from './Model';
import Message from './Message';
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

class Account extends Model {

  static _fields = ['userId', 'type', 'host', 'port', 'identifier', 'password'];
  static _defaults = {};
  static _tableName = 'accounts';

  constructor(props) {
    super(props);

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

  static findOne(id, userPass) {
    const doDecrypt = typeof userPass === 'string';

    const selectQuery = `select id, userId, type, host, port, identifier, password from accounts where id = ${id}`;
    console.log(selectQuery)
    return pool.query(selectQuery)
      .then(records => (records[0]))
      .then(passLog('record'))
      .then(account => (! doDecrypt ? account : Object.assign(account, {
        password: decrypt(account.password, userPass)
      })))
      .then(passLog('decrypted pass'))
      .then(props => new Account(props));
  }

  static beforeCreate(account, userPass) {
    // console.log('\n\n### Account.beforeCreate', arguments);
    const password = encrypt(account.password, userPass);
    return Promise.resolve(Object.assign(account, { password }));
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
    // console.log('\n\n##### Account.fetchMessages', idUidls)
    return Promise.reduce(idUidls, this.fetchMessage, []);
  }

  fetchRemoteMessages(start = 0, num = 0) {
// console.log('#### this.socketIOHandler', this.socketIOHandler);
    return chain(this.listRemoteMessages())
    // .then(passLog('returned by listRemoteMessages'))
    .then(idUidls => (
      num ? idUidls.slice(start, num) : idUidls
    ))
    // .then(passLog('after optional slice'))
    // .then((_this => stuff => { console.log('this', _this.socketIOHandler); return stuff; })(this))
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
    // console.log('##### fetchMessage', msgIdUidl);

    const [msgId, uidl] = msgIdUidl;
    return Message.findOneByUidl(uidl, this.id)
    .then(message => {

      // BYPASS DB

      if(message) {
        return message;
      }
      return this.pop3.RETR(msgId)
      // .then(passLog('\n\nfetchMessage #1 stream'))
      .then(this.readEmailStream)
      .then(this.parseEmail(uidl))
      // .then(passLog('\n\nfetchMessage #2 parsed'))
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

Model._classes.Account = Account;
export default Account;