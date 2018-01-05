import { users, app } from './feathers';

let id = 0;
// app.logout();
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
    return fetch('/authentication', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        ...credentials, strategy: 'local'
      })
    })
      .then(response => response.json())
    // return app.authenticate({
    //   ...credentials,
    //   strategy: 'local'
    // })
      .then(function(result){
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

  updateUser(user) {
    const { id, firstName, lastName, email } = user;
    return users.patch(id, user)
      .then(user => {
        console.log('got UPDATED user', user);
        return user;
      });
  }

}

const client = new clientAPI();
export default client;
