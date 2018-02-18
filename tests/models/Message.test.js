const chai = require('chai');
const expect = chai.expect;
const User = require('../../dist/models/user').default;
const Account = require('../../dist/models/account').default;
const Message = require('../../dist/models/Message').default;
const Promise = require('bluebird');
const chain = require('store-chain');
const credentials = require('../../credentials.test.json');

const getId = (() => {
  let id = 0;
  return () => (++id);
})();

const getEmail = (() => {
  return () => 'test.user.' + getId() + '@example.com';
})();

describe('Account model test', () => {

  it('creates an user and an account', () =>
    User.create({
      email: getEmail(), password: 'unsecure'
    })
    .then(user => Account.create(
      Object.assign({
        userId: user.id,
        type: 'POP3'
      }, credentials), 'unsecure')
    )
    .then(account => Message.create({
      uidl: 'dummy.uidl.' + Date.now(),
      accountId: account.id,
      senderName: 'Foo Bar',
      senderEmail: 'foo@bar.org',
      subject: 'Test Email',
      raw: 'raw content',
      html: '<html><head></head><body><h1>Yo</h1></body></html>'
    }))
    .then(() => Message.findAll())
    .then(console.log)
  );

});