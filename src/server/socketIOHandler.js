class SocketIOHandler {
	constructor(io) {
		this.io = io;
    this.users = {};

    this.onAuthSuccess = this.onAuthSuccess.bind(this);
    this.onMessageFetchSuccess = this.onMessageFetchSuccess.bind(this);
    this.onMessageFetchError = this.onMessageFetchError.bind(this);

		this.io.on('connection', socket => {
		  socket.emit('news', { hello: 'world' });
		  socket.on('auth:success', this.onAuthSuccess(socket));
		});
	}

  onMessageFetchSuccess(userId, message) {
    const { socket } = this.users[userId];
    console.log('## FETCH SUCCESS, EMIT TO CLIENT', message);
    socket.emit('message:fetch:success', message);
  }

  onMessageFetchError(error) {

  }

  onAuthSuccess(socket) {
    return user => {
      this.users[user.id] = { user, socket };
      console.log('received from client', user, this.users);
    }
  }
}

let instance;

module.exports = function(io) {
  if(io) {
    instance = new SocketIOHandler(io);
  }
  if(! io && ! instance) {
    throw new Error('SocketIOHandler instance should be created first');
  }
  return instance;
}