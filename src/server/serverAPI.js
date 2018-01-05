let id = 0;
export function insertUser(user) {
  console.log('INSERT USER SERVER', user);
  ++id;
  return Promise.resolve(Object.assign({...user}, {id}));
}

export function authenticateUser(user) {
  console.log('AUTHENTICATE USER SERVER', user);
  return Promise.resolve({...user});
}
