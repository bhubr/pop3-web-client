// Other
import Promise from 'bluebird';
import chain from 'store-chain';
import Pop3Command from 'node-pop3';
import { simpleParser } from 'mailparser';
import cheerio from 'cheerio';
import Message from './models/message';
// import credentials from './credentials.json';


function extractMessageId(entry) {
  const [msgId, uidl] = entry;
  return parseInt(msgId);
}

function extractMessageIds(entries) {
  return entries.map(extractMessageId);
}

function passLog(v) {
  console.log(v); return v;
}


function getFetchMessage(pop3, accountId) {
  return (carry, msgIdUidl) => {
    const [msgId, uidl] = msgIdUidl;
    return Message.findOneByUidl(uidl)
    .then(message => {
      if(message) {
        return message;
      }
      return new Promise((resolve, reject) => {
        pop3.RETR(msgId)
        .then(stream => simpleParser(stream,
          (err, mail) => {
            if (err) {
              return reject(err);
            }
            const { html, textAsHtml } = mail;
            const theHtml = html ? html : textAsHtml;
            const $ = cheerio.load(theHtml);
            const body = $('body').html();

            // console.log(accountId, theHtml.substr(0, 40));
            // const style = $('style').html();
            resolve({
              accountId,
              uidl,
              raw: JSON.stringify(mail),
              html: theHtml
            });
          })
        )
      })
      .then(passLog)
      .then(props => Message.create(props))
      .then(message => carry.concat([message]))
    });
  }
}

function getFetchMessages(pop3, accountId) {
  const fetchMessage = getFetchMessage(pop3, accountId);
  return idUidls => Promise.reduce(idUidls, fetchMessage, []);
}

export function listRemoteMessages(credentials) {
  const pop3 = new Pop3Command(credentials);
  return chain(pop3.UIDL())
  .set('messages')
  .then(() => pop3.QUIT())
  .get(({ messages }) => (messages));
}

export function fetchRemoteMessages(account, start = 0, num = 2) {
  const pop3 = new Pop3Command(account.getPop3Credentials());
  const fetchFunc = getFetchMessages(pop3, account.id);
  let messages;

  return chain(pop3.UIDL())
  .then(idUidls => idUidls.slice(start, num))
  .then(fetchFunc)
  .set('messages')
  .then(() => pop3.QUIT())
  .get(({ messages }) => (messages));
}
