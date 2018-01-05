const feathers = require('@feathersjs/feathers');
const express  = require('@feathersjs/express');
const auth     = require('@feathersjs/authentication');
const local    = require('@feathersjs/authentication-local');
const jwt      = require('@feathersjs/authentication-jwt');
const socketio = require('@feathersjs/socketio');
const config   = require('./config');
const usersSrv = require('./services/users');
const _        = require('lodash');
const Promise  = require('bluebird');
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { Provider } from 'react-redux';
import { matchPath } from 'react-router-dom';
import MyApp from './components/MyApp';
import initStore from './initStore';
import api from './api';
import serverAPI from './serverAPI';
api.setStrategy(serverAPI);

function transformFields(fields) {
  return function(data) {
    let output = {};
    fields.forEach(f => {
      output[ _.snakeCase(f) ] = data[f];
    });
    console.log('transformed', data, output);
    return output;
  };
}

class Messages {
  constructor() {
    this.messages = [{
      id: 1,
      text: 'This is a dummy message'
    }, {
      id: 2,
      text: 'This is another dummy text'
    }];
    this.currentId = 2;
  }

  async find(params) {
    // Return the list of all messages
    return this.messages;
  }

  async get(id, params) {
    // Find the message by id
    const message = this.messages.find(message => message.id === parseInt(id, 10));

    // Throw an error if it wasn't found
    if(!message) {
      throw new Error(`Message with id ${id} not found`);
    }

    // Otherwise return the message
    return message;
  }

  async create(data, params) {
    // Create a new object with the original data and an id
    // taken from the incrementing `currentId` counter
    const message = Object.assign({
      id: ++this.currentId,
      text: 'N/A'
    }, data);

    this.messages.push(message);

    return message;
  }

  async patch(id, data, params) {
    // Get the existing message. Will throw an error if not found
    const message = await this.get(id);

    // Merge the existing message with the new data
    // and return the result
    return Object.assign(message, data);
  }

  async remove(id, params) {
    // Get the message by id (will throw an error if not found)
    const message = await this.get(id);
    // Find the index of the message in our message array
    const index = this.messages.indexOf(message);

    // Remove the found message from our array
    this.messages.splice(index, 1);

    // Return the removed message
    return message;
  }
}

const app = express(feathers());

const messagesSrv = new Messages();

// Turn on JSON parser for REST services
app
  .use(express.json())
  // Turn on URL-encoded parser for REST services
  .use(express.urlencoded({ extended: true }))
  // Static assets
  .use(express.static(__dirname + '/public'))
  // Set up REST transport
  .configure(express.rest())
  // Socket IO
  .configure(socketio())

  // Local&JWT auth
  .configure(auth({
    secret: config.secret
  }))
  .configure(local())
  .configure(jwt())

  // Initialize the messages service by creating
  // a new instance of our class
  .use('api/messages', messagesSrv)
  .use('users', usersSrv)

  // Set Twig.js as view engine
  .set('view engine', 'twig');

// Auth hooks
app.service('authentication').hooks({
  before: {
    create: [
      // You can chain multiple strategies
      auth.hooks.authenticate(['jwt', 'local'])
    ],
    remove: [
      auth.hooks.authenticate('jwt')
    ]
  },
  after: {
    create: [
      context => {
        context.result.userId = context.params.user.id;
      }
    ]
  }
});

// Add a hook to the user service that automatically replaces
// the password with a hash of the password before saving it.
app.service('users').hooks({
  before: {
    find: [
      auth.hooks.authenticate('jwt')
    ],
    create: [
      local.hooks.hashPassword({ passwordField: 'password' }),
      function(context) {
        console.log(context.data, arguments);
        context.data = transformFields(['firstName', 'lastName', 'email', 'password'])(context.data);
      }
    ]
  },
  after: {
    get: [
      context => {
        context.result.firstName = context.result.first_name;
        context.result.lastName = context.result.last_name;
        delete context.result.password;
        delete context.result.first_name;
        delete context.result.last_name;
      }
    ]
  }
});

// server (not the complete story)
// <StaticRouter
//   location={req.url}
//   context={context}
// >
//   <App/>
// </StaticRouter>
const routes = [{
  path: '/messages',
  loadData: async function() {
    const messages = await messagesSrv.find();
    return { messages };
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
      // console.log('it matches!', match);
      promises.push(route.loadData(match));
    }
    return match;
  });

  Promise.all(promises).then(data => {
    const state = JSON.stringify(data[0] || {});
    console.log('Got data', data, state);

    const store = initStore({});
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
      res.status(status).render('app.html.twig', { markup, state });
    }
  });


});

// app.get('/login', (req, res) => {
//   res.render('login.html.twig');
// });
//
// app.get('/register', (req, res) => {
//   res.render('register.html.twig');
// });



const server = app.listen(3008);

server.on('listening', () => console.log('Feathers application started'));
