import pool from '../db';
import bcrypt from 'bcrypt';
import cheerio from 'cheerio';
import Promise from 'bluebird';

// https://stackoverflow.com/questions/7744912/making-a-javascript-string-sql-friendly
function mysqlEscape (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}

function trimAndQuote(v) {
  return typeof v === 'string' ?
    "'" + mysqlEscape(v.trim()) + "'" : v;
}

function passLog(v) {
  console.log(v); return v;
}

function extractMessageBody(message) {
  // console.log(message.raw);
  const $ = cheerio.load(message.html);
  message.body = $('body').html().trim();
  return message;
}

export default class Message {

  constructor(props) {
    this.id = props.id;
    this.accountId = props.accountId;
    this.uidl = props.uidl;
    this.senderName = props.senderName;
    this.senderEmail = props.senderEmail;
    this.subject = props.subject;
    this.raw = props.raw;
    this.html = props.html;
  }

  static findAll(accountId) {
    return pool
      .query(`select id, accountId, uidl, senderName, senderEmail, subject, raw, html from messages where accountId = ${accountId}`)
      .then(messages => messages.map(extractMessageBody));
  }

  static findOne(id) {
    const selectQuery = `select id, accountId, uidl, senderName, senderEmail, subject, raw, html from messages where id = ${id}`;
    return pool.query(selectQuery)
      .then(records => (records[0]))
      .then(props => new Message(props));
  }

  static findOneByUidl(uidl) {
    const selectQuery = `select id, accountId, uidl, senderName, senderEmail, subject, raw, html from messages where uidl = '${uidl}'`;
    return pool.query(selectQuery)
      .then(records => (records[0]))
      .then(props => (props ? new Message(props) : undefined));
  }

  static create(message) {
    const requiredKeys = ['accountId', 'uidl', 'senderName', 'senderEmail', 'subject', 'raw', 'html'];
    for(let i = 0 ; i < requiredKeys.length ; i++) {
      const k = requiredKeys[i];
      if(! message[k]) {
        return Promise.reject(new Error(`required key '${k}' is missing`));
      }
    }
    for(let k in message) {
      if(requiredKeys.indexOf(k) === -1) {
        return Promise.reject(new Error(`unexpected key '${k}'`));
      }
    }
    const fields = Object.keys(message).join(',');
    const values = Object.values(message).map(trimAndQuote).join(',');
    const insertQuery = `insert into messages(${fields}) values(${values})`;
    return pool
      .query(insertQuery)
      .then(result => Message.findOne(result.insertId))
      .then(props => new Message(props));
  }

  static delete(id) {
    const deleteQuery = 'delete from messages where id = ' + id;
    return pool
      .query(deleteQuery);
  }

}