// Inspired by FeathersJS docs and:
// https://github.com/Alexisvt/featherjs-react-seed/blob/master/app/common/index.js
import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import localstorage from 'feathers-localstorage';
import authentication from '@feathersjs/authentication-client';

const socket = io('http://localhost:3008/');
const app = feathers()
  .configure(socketio(socket)) // you could use Primus or REST instead
  .configure(authentication({ storage: window.localStorage }));

const users = app.service('users');
export {
  users, app
};
