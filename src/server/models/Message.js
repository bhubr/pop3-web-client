import pool from '../db';
import bcrypt from 'bcrypt';
import cheerio from 'cheerio';
import Promise from 'bluebird';
import Model from './Model';
import { isInt } from '../utils';

function extractMessageBody(message) {

}

class Message extends Model {

  static _fields = ['accountId', 'uidl', 'senderName', 'senderEmail', 'subject', 'raw', 'html', 'body'];
  static _defaults = {
    body: ''
  };
  static _tableName = 'messages';


  // static findAll(accountId, optHash) {
  //    optHash = optHash || {};
  //    var whereHash = Object.assign({ accountId }, optHash);
  //    const baseQuery = `select id, accountId, uidl, senderName, senderEmail, subject, raw, html, body from messages`;
  //    let whereStrings = [];
  //    for(let k in whereHash) {
  //      whereStrings.push(k + '=' + trimAndQuote(whereHash[k]));
  //    }
  //    const whereCondition = whereStrings.length ? ' WHERE ' + whereStrings.join(' AND ') : '';
  //    console.log('Account.findAll', baseQuery + whereCondition);
  //    return pool
  //      .query(baseQuery + whereCondition)
  //     .then(messages => messages.map(extractMessageBody));
  // }

  // static findOne(id) {
  //   const selectQuery = `select id, accountId, uidl, senderName, senderEmail, subject, raw, html, body from messages where id = ${id}`;
  //   return pool.query(selectQuery)
  //     .then(records => (records[0]))
  //     .then(props => new Message(props));
  // }

  // static findOneByUidl(uidl) {
  //   const selectQuery = `select id, accountId, uidl, senderName, senderEmail, subject, raw, html, body from messages where uidl = '${uidl}'`;
  //   return pool.query(selectQuery)
  //     .then(records => (records[0]))
  //     .then(props => (props ? new Message(props) : undefined));
  // }

  static findOneByUidl(uidl, accountId) {
    if(typeof uidl !== 'string' || ! isInt(accountId)) {
      throw new Error(`findOneByUidl requires (str: uidl, int: accountId), got ${uidl} and ${accountId}`);
    }
    return this.findAll({ uidl, accountId })
    .then(records => (records.length > 0 ? new Message(records[0]) : undefined))
  }

  static beforeCreate(message) {
    return new Promise((resolve, reject) => {
      const $ = cheerio.load(message.html);
      message.body = $('body').html().trim();
      resolve(message);
    });
  }

  // static create(message) {
  //   const requiredKeys = ['accountId', 'uidl', 'senderName', 'senderEmail', 'subject', 'raw', 'html', 'body'];
  //   // for(let i = 0 ; i < requiredKeys.length ; i++) {
  //   //   const k = requiredKeys[i];
  //   //   if(! message[k]) {
  //   //     return Promise.reject(new Error(`required key '${k}' is missing`));
  //   //   }
  //   // }
  //   for(let k in message) {
  //     if(requiredKeys.indexOf(k) === -1) {
  //       return Promise.reject(new Error(`unexpected key '${k}'`));
  //     }
  //   }
  //   const fields = Object.keys(message).join(',');
  //   const values = Object.values(message).map(trimAndQuote).join(',');
  //   const insertQuery = `insert into messages(${fields}) values(${values})`;
  //   return pool
  //     .query(insertQuery)
  //     .then(result => Message.findOne(result.insertId))
  //     .then(props => new Message(props));
  // }

  // static delete(id) {
  //   const deleteQuery = 'delete from messages where id = ' + id;
  //   return pool
  //     .query(deleteQuery);
  // }

}

Model._classes.Message = Message;
export default Message;