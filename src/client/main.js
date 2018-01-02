import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import localstorage from 'feathers-localstorage';
import authentication from '@feathersjs/authentication-client';

const socket = io('http://localhost:3008/');
const app = feathers()
  .configure(socketio(socket)) // you could use Primus or REST instead
  .configure(authentication({ storage: window.localStorage }));

app.authenticate({
  strategy: 'local',
  email: 'pat@ytc.tls',
  password: 'pat'
}).then(function(result){
  console.log('Authenticated!', result);
}).catch(function(error){
  console.error('Error authenticating!', error);
});
