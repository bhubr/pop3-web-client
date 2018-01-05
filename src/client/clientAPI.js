import { users, app } from './feathers';

let id = 0;

class clientAPI {

  insertUser(user) {
    // console.log('INSERT USER CLIENT', user);
    // ++id;
    // return Promise.resolve(Object.assign({...user}, {id}));
    return users.create(user)
      .then(result => {
        console.log('USER CREATED', user);
        return user;
      });
  }

  authenticateUser(credentials) {
    const self = this;
    const { email } = credentials;
    return app.authenticate({
      ...credentials,
      strategy: 'local'
    }).then(function(result){
      console.log('Authenticated!', result);
      return users.get(result.userId)
        .then(user => {
          console.log('got user', user);
          return user;
        });
    });
    // .catch(function(error){
    //   console.error('Error authenticating!', error);
    // });
  }

}

const client = new clientAPI();
export default client;
