const chai = require('chai');
const expect = chai.expect;
const pool = require('../../dist/db');
const User = require('../../dist/models/User').default;
const UserProfile = require('../../dist/models/UserProfile').default;
const clearDatabase = require('../_utils/clearDatabase');

const getId = (() => {
  let id = 0;
  return () => (++id);
})();

const getEmail = (() => {
  return () => 'test.user.' + getId() + '@example.com';
})();


describe('User model test', () => {

  before(clearDatabase);
  after(done => done());

  it('hashes password', () =>
    User.hashPassword('unsecure')
    .then(hash => {
      expect(hash).to.be.a('string');
      expect(hash.length).to.be.equal(60);
    })
  );

  it('creates a user with empty pass', () =>
    User.create({
      email: getEmail(), password: undefined
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
    .then(() => UserProfile.findAll())
    .then(([profile]) => {
      expect(profile.id).to.equal(1);
      expect(profile.userId).to.equal(1);
    })
  );

  it('reads all users', () =>
    User.findAll()
    .then(users => {
      expect(users.length).to.equal(1);
    })
  );

  it('authenticate a user (wrong pass)', () => {
    const user = {
      email: getEmail(), password: 'Pass12$'
    };
    return User.create(user)
    .then(() => User.authenticate({ email: user.email, password: 'Wrong!!!' }))
    .then(result => {
      expect(result).to.be.a('boolean');
      expect(result).to.equal(false);
    });
  });

  it('authenticate a user', () => {
    const userProps = {
      email: getEmail(), password: 'Pass12$'
    };
    let user;
    return User.create(userProps)
    .then(_user => { user = _user; })
    .then(() => User.authenticate(userProps))
    .then(_user => {
      expect(_user).to.be.a('object');
      expect(_user.id).to.equal(user.id);
      expect(_user.email).to.equal(user.email);
    });
  });

});