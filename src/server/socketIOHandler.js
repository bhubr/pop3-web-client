class SocketIOHandler {

	constructor(io) {
    this.users = {};

    this.onAuthSuccess = this.onAuthSuccess.bind(this);
    this.onMessageFetchSuccess = this.onMessageFetchSuccess.bind(this);
    this.onMessageFetchError = this.onMessageFetchError.bind(this);
    this.onMessageListSuccess = this.onMessageListSuccess.bind(this);

	}

  setIo(io) {
    this.io = io;
    this.io.on('connection', socket => {
      socket.on('auth:success', this.onAuthSuccess(socket));
    });
  }

  onMessageListSuccess(userId) {
    return idUidls => {
      const { socket } = this.users[userId];
      console.log('## LIST SUCCESS, EMIT TO CLIENT', idUidls);
      socket.emit('message:list:success', idUidls);
      return idUidls;
    }
  }

  onMessageFetchSuccess(userId) {
    return message => {
      const { socket } = this.users[userId];
      console.log('## FETCH SUCCESS, EMIT TO CLIENT', message);
      socket.emit('message:fetch:success', message);
      return message;
    }
  }

  onMessageFetchError(userId) {
    return error => {
      const { socket } = this.users[userId];
      console.error('## FETCH ERROR, EMIT TO CLIENT', error);
      socket.emit('message:fetch:error', error.message);
      return true;
    }
  }

  onAuthSuccess(socket) {
    return user => {
      this.users[user.id] = { user, socket };
      console.log('received from client', user, this.users);
    }
  }
}


class SocketIOHandlerTest {

  setIo(io) {}

  onMessageListSuccess(userId) {
    return idUidls => (idUidls);
  }

  onMessageFetchSuccess(userId) {
    return message => (message);
  }

  onMessageFetchError(userId) {
    return error => (true);
  }

  onAuthSuccess(socket) {
    return user => (undefined);
  }
}

// let instance;

// module.exports = function(io) {
//   if(io) {
//     instance = new SocketIOHandler(io);
//   }
//   if(! io && ! instance) {
//     throw new Error('SocketIOHandler instance should be created first');
//   }
//   return instance;
// }
module.exports = process.env.NODE_ENV === 'test' ? new SocketIOHandlerTest() : new SocketIOHandler();