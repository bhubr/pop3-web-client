const feathers = require('@feathersjs/feathers');
const express  = require('@feathersjs/express');
const auth     = require('@feathersjs/authentication');
const local    = require('@feathersjs/authentication-local');
const jwt      = require('@feathersjs/authentication-jwt');
const socketio = require('@feathersjs/socketio');
const config   = require('./config');
const usersSrv = require('./services/users');
const _        = require('lodash');

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
    this.messages = [];
    this.currentId = 0;
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
      id: ++this.currentId
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
  .use('messages', new Messages())
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


app.get('/', (req, res) => {
  res.render('index.html.twig');
});

app.get('/login', (req, res) => {
  res.render('login.html.twig');
});

app.get('/register', (req, res) => {
  res.render('register.html.twig');
});



const server = app.listen(3008);

server.on('listening', () => console.log('Feathers application started'));
