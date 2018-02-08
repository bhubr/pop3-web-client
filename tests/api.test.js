const chai = require('chai');
const expect = chai.expect;
const api = require('../dist/api').default;
const serverAPI = require('../dist/serverAPI');
api.setStrategy(serverAPI);
const { User } = api;

describe('Test API', () => {

  it('Get a user by its ID', () =>
    User.findOne(1)
    .then(user => {
      console.log(user);
    })
  );

});