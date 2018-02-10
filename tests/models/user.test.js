const chai = require('chai');
const expect = chai.expect;
const pool = require('../../dist/db');
const User = require('../../dist/models/user').default;


const getId = (() => {
  let id = 0;
  return () => (++id);
})();

const getEmail = (() => {
  return () => 'test.user.' + getId() + '@example.com';
})();


describe('User model test', () => {

  before(() => pool.query('truncate table users'));

  it('hashes password', () =>
    User.hashPassword('unsecure')
    .then(hash => {
      expect(hash).to.be.a('string');
      expect(hash.length).to.be.equal(60);
    })
  );

  it('creates a user with empty pass', () =>
    User.create({
      email: getEmail(), password: ''
    })
    .then(() => {
      expect(false).to.be.equal(true);
    })
    .catch(err => {
      expect(err.message).to.be.equal("required key 'password' is missing")
    })
  );

  it('creates a user', () =>
    User.create({
      email: getEmail(), password: 'unsecure'
    })
    .then(user => {
      expect(user).to.be.a('object');
      expect(user.email).to.equal('test.user.2@example.com');
      expect(user.password).to.be.a('undefined');
    })
  );

  it('reads all users', () =>
    User.findAll()
    .then(users => {
      expect(users.length).to.equal(1);
    })
  );

});