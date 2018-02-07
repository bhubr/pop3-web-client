// Express and related stuff
import express from 'express';
import bodyParser from 'body-parser';

// React and related stuff
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { Provider } from 'react-redux';
import { matchPath } from 'react-router-dom';
import MyApp from './components/MyApp';
import initStore from './initStore';

// Other
import Promise from 'bluebird';
import chain from 'store-chain';
import Pop3Command from 'node-pop3';
import charsetDetector from 'node-icu-charset-detector';
import iconvlite from 'iconv-lite';
import credentials from './credentials.json';
const simpleParser = require('mailparser').simpleParser;


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
          console.log(mail);
          resolve(carry.concat([mail]));
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


function getMessages(start = 0, num = 2) {
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




const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/messages', (req, res) => {
  getMessages()
  .then(messages => res.json(messages));

});

app.get('*', (req, res) => {

    const initialState = {};
    const stateJSON = JSON.stringify(initialState);
    const store = initStore(initialState);
    // do something w/ the data so the client
    // can access it then render the app

    const context = {};
    console.log('req.url / context', req.url, context);
    const markup = ReactDOMServer.renderToString(
      <Provider store={store}>
        <StaticRouter
          location={req.url}
          context={context}>
          <MyApp/>
        </StaticRouter>
      </Provider>
    );
    console.log('context after', context);

    const status = context.status ? context.status : 200;

    if (context.url) {
      // Somewhere a `<Redirect>` was rendered
      res.redirect(status, context.url);
    } else {
      // we're good, send the response
      res.status(status).render('app.html.twig', { markup, state: stateJSON });
    }
  });

app.listen(3000);
