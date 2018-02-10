

// let id = 0;
 

// class serverAPI {

//   insertUser(user) {
//     console.log('INSERT USER SERVER', user);
//     ++id;
//     return Promise.resolve(Object.assign({...user}, {id}));
//   }

//   authenticateUser(user) {
//     console.log('AUTHENTICATE USER SERVER', user);
//     return Promise.resolve({...user});
//   }

// }

// const server = new serverAPI();
// export default server;

import User from './models/user';

export { User };