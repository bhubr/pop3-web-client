// Other
import Promise from 'bluebird';
import chain from 'store-chain';
import Pop3Command from 'node-pop3';
import { simpleParser } from 'mailparser';
import cheerio from 'cheerio';
import credentials from './credentials.json';


function extractMessageId(entry) {
  const [msgId, uidl] = entry;
  return parseInt(msgId);
}

function extractMessageIds(entries) {
  return entries.map(extractMessageId);
}

function getFetchMessage(pop3) {
  return (carry, msgId) => {
    return new Promise((resolve, reject) => {
      pop3.RETR(msgId)
      .then((stream) => {
        simpleParser(stream, (err, mail)=>{
          if (err) {
            return reject(err);
          }
          const { html, textAsHtml } = mail;
          const $ = cheerio.load(html ? html : textAsHtml);
          const body = $('body').html();
          const style = $('style').html();
          resolve(carry.concat([ { ...mail, body, style } ]));
        })
      });
    });
  }
}

function getFetchMessages(pop3) {
  const fetchMessage = getFetchMessage(pop3);
  return ids => Promise.reduce(ids, fetchMessage, []);
}

export function getMessages(start = 0, num = 2) {
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
