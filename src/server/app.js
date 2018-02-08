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

app.post('/api/users', (req, res) => {
  User.create(req.body)
  .then(user => res.json(user));
});

app.post('/authentication', (req, res) => {
  User.authenticate(req.body)
  .then(userOrFalse => (userOrFalse ?
    res.json(userOrFalse) : res.status(401).json({ error: 'failed' })
  ));
});

const routes = [{
  path: '/inbox/:acntId',
  loadData: async function() {
    const messages = await api.call('getMessages');
    return messages;
  }
}];

app.get('*', (req, res) => {

  // inside a request
  const promises = [];
  // use `some` to imitate `<Switch>` behavior of selecting only
  // the first to match
  routes.some(route => {
    // console.log('route', req.url, route);
    // use `matchPath` here
    const match = matchPath(req.url, route);
    if (match) {
      console.log('it matches!', match);
      promises.push(route.loadData(match));
    }
    return match;
  });

  Promise.all(promises).then(data => {
    const { user } = req;
    const session = { user };
    // let initialState = {
    //   session
    // };

    const initialState = JSON.stringify(data[0] || {});
    const stateJSON = JSON.stringify(initialState);
    console.log('Got data', data, stateJSON);

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
});

app.listen(3000);
