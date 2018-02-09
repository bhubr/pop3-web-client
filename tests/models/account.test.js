const chai = require('chai');
const expect = chai.expect;
const pool = require('../../dist/db');
const User = require('../../dist/models/user').default;
const Account = require('../../dist/models/account').default;
const Promise = require('bluebird')
const chain = require('store-chain');
const { encrypt, decrypt } = require('../../dist/utils');

const getId = (() => {
  let id = 0;
  return () => (++id);
})();

const getEmail = (() => {
  return () => 'test.user.' + getId() + '@example.com';
})();


describe('Account model test', () => {

  let accountId;
  let userId;

  before(() => pool.query('delete from accounts')
    .then(() => pool.query('delete from users'))
  );

  it('creates an account with empty fields', () =>
    Account.create({})
    .then(() => {
      expect(false).to.be.equal(true);
    })
    .catch(err => {
      expect(err.message).to.be.equal("required key 'userId' is missing")
    })
  );

  it('creates an user and an account', () =>
    chain(User.create({
      email: getEmail(), password: 'unsecure'
    }))
    .set('user')
    .then(user => Account.create({
      userId: user.id, identifier: user.email, password: 'somepass', host: 'pop.example.com'
    }, 'unsecure'))
    .set('account')
    .get(({ account, user }) => {
      userId = user.id;
      accountId = account.id;
      expect(account).to.be.a('object');
      expect(account.userId).to.equal(user.id);
      expect(account.identifier).to.equal('test.user.1@example.com');
      expect(account.host).to.equal('pop.example.com');
      expect(account.identifier).to.equal('test.user.1@example.com');
      expect(account.password).to.be.equal(encrypt('somepass', 'unsecure'));
    })
  );

  it('reads all accounts', () =>
    Account.findAll()
    .then(accounts => {
      expect(accounts.length).to.equal(1);
    })
  );

  it('reads one account w/ decrypt', () =>
    Account.findOne(accountId, 'unsecure')
    .then(account => {
      expect(account.password).to.equal('somepass');
    })
  );

  it('reads one account w/o decrypt', () =>
    Account.findOne(accountId)
    .then(account => {
      expect(account.password).to.equal(encrypt('somepass', 'unsecure'));
    })
  );
});