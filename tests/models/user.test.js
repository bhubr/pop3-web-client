const chai = require('chai');
const expect = chai.expect;
const User = require('../../dist/models/user');

describe('User model test', () => {

  it('reads all users', () => {
    User.readAll()
    .then(users => {
      expect(users.length).to.equal(0);
    })
  });

});