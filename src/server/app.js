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

import api from './api';
import serverAPI from './serverAPI';
import User from './models/user';

console.log(serverAPI);
api.setStrategy(serverAPI);


const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/messages', (req, res) => {
  api.call('getMessages')
  .then(messages => res.json(messages))
  .catch(console.error);

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
