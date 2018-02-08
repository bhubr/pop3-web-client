// Other
import Promise from 'bluebird';
import chain from 'store-chain';
import Pop3Command from 'node-pop3';
// import charsetDetector from 'node-icu-charset-detector';
// import iconvlite from 'iconv-lite';
import { simpleParser } from 'mailparser';
import cheerio from 'cheerio';

import credentials from './credentials.json';
// const simpleParser = require('mailparser').simpleParser;


// https://stackoverflow.com/questions/28594498/converting-a-string-from-utf8-to-latin1-in-nodejs
// function getBufferContentsInUTF8(buffer) {
//   var originalCharset = charsetDetector.detectCharset(buffer);
//   var jsString = iconvlite.decode(buffer, originalCharset.toString());
//   return jsString;
// }


function extractMessageId(entry) {
  const [msgId, uidl] = entry;
  return parseInt(msgId);
}

function extractMessageIds(entries) {
  return entries.map(extractMessageId);
}

function getFetchMessage(pop3) {
  return (carry, msgId) => {
    // console.log('getFetchMessage', carry, msgId);
    return new Promise((resolve, reject) => {
      pop3.RETR(msgId)
      .then((stream) => {
        // console.log(stream);
        // stream.on('data', (chunk) => {
        //   console.log(`Received ${chunk.length} bytes of data.`);
        // });
        // stream.on('end', (chunk) => {
        //   console.log('chunk end');
        // });
        // console.log(stream);
        // stream.on('data', (chunk) => {
        //   console.log(`Received ${chunk.length} bytes of data.`, chunk.toString('hex'), chunk.toString(), getBufferContentsInUTF8(chunk));
        // });
        // deal with mail stream
        simpleParser(stream, (err, mail)=>{
          if (err) {
            return reject(err);
          }
          const { html, textAsHtml } = mail;
          // console.log(mail);
          const $ = cheerio.load(html ? html : textAsHtml);
          const body = $('body').html();
          const style = $('style').html();
          resolve(carry.concat([ { ...mail, body, style } ]));
        })
      });
      // .then(() => pop3.QUIT());
    });
  }
}

function getFetchMessages(pop3) {
  const fetchMessage = getFetchMessage(pop3);
  return ids => Promise.reduce(ids, fetchMessage, []);
}


let id = 0;
 

class serverAPI {

  getMessages(start = 0, num = 2) {
    const pop3 = new Pop3Command(credentials);
    const fetchMessages = getFetchMessages(pop3);
    let messages;

    return chain(pop3.UIDL())
    .then(extractMessageIds)
    .then(ids => ids.slice(start, num))
    .then(fetchMessages)
    .set('messages')
    .then(() => pop3.QUIT())
    .get(({ messages }) => (messages));

  }

  insertUser(user) {
    console.log('INSERT USER SERVER', user);
    ++id;
    return Promise.resolve(Object.assign({...user}, {id}));
  }

  authenticateUser(user) {
    console.log('AUTHENTICATE USER SERVER', user);
    return Promise.resolve({...user});
  }

}

const server = new serverAPI();
export default server;