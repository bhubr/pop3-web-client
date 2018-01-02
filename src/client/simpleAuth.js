import { users, app } from './feathers';

const simpleAuth = {
  // isAuthenticated: false,
  user: null,
  authenticate(credentials) {
    const self = this;
    const { email } = credentials;
    return app.authenticate({
      ...credentials,
      strategy: 'local'
    }).then(function(result){
      console.log('Authenticated!', result);
      users.get(result.userId)
        .then(user => {
          console.log('got user', user);
          self.user = user;
        });
    }).catch(function(error){
      console.error('Error authenticating!', error);
    });

  },

  signout(cb) {
    self.user = null;
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(true), 100);
    });
  }
};

export default simpleAuth;
