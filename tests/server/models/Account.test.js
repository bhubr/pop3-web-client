const chai = require('chai');
const expect = chai.expect;
const User = require('../../../dist/models/User').default;
const Account = require('../../../dist/models/Account').default;
const Message = require('../../../dist/models/Message').default;
const Promise = require('bluebird');
const chain = require('store-chain');
const { encrypt, decrypt } = require('../../../dist/utils');
const credentials = require('../../../credentials.test.json');
const clearDatabase = require('../../_utils/clearDatabase');
const passLog = require('../../_utils/passLog');
const {
  createEmail
} = require('../../_resources/redis-pub');
const {
  startPop3Server,
  killPop3Server
} = require('../../_resources/fake-pop3-control');


const UIDL_DATE = 1514764800000;

const getId = (() => {
  let id = 0;
  return () => (++id);
})();

const getEmail = (() => {
  return () => 'test.user.' + getId() + '@example.com';
})();

function getExpectedUidl(index) {
  return ('uid' + index) + (UIDL_DATE + index * 1000);
}


describe('Account model test', () => {

  let accountId;
  let userId;

  before(() => clearDatabase()
    .then(startPop3Server)
  );

  after(killPop3Server);

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
    .then(user => Account.create(
      Object.assign({
        userId: user.id,
        type: 'POP3'
      }, credentials), 'unsecure')
    )
    .set('account')
    .get(({ account, user }) => {
      userId = user.id;
      accountId = account.id;
      expect(account).to.be.a('object');
      expect(account.userId).to.equal(user.id);
      expect(account.type).to.equal('POP3');
      expect(account.host).to.equal(credentials.host);
      expect(account.identifier).to.equal(credentials.identifier);
      expect(account.password).to.be.equal(encrypt(credentials.password, 'unsecure'));
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
      expect(account.password).to.equal(credentials.password);
    })
  );

  it('reads one account w/o decrypt', () =>
    Account.findOne(accountId)
    .then(account => {
      expect(account.password).to.equal(encrypt(credentials.password, 'unsecure'));
    })
  );

  it('reads account remote messages', () =>
    chain(Account.findOne(accountId, 'unsecure'))
    .set('account')
    .then(account => account.listRemoteMessages())
    .then(() => Promise.all([
      // createEmail(1, 'John Difool', 'johndifool@example.com'),
      // createEmail(2, 'John Difool', 'johndifool@example.com'),
      // createEmail(3, 'John Difool', 'johndifool@example.com'),
    ]))
    .get(({ account }) => account.listRemoteMessages())
    .then(messages => {
      console.log(`GOT ${messages.length} MESSAGES`);
      expect(messages.length).to.equal(3);
      const [[m1id, m1uidl], [m2id, m2uidl], [m3id, m3uidl]] = messages;
      expect(m1id).to.equal('1');
      expect(m1uidl).to.equal('msg_1');
      expect(m2id).to.equal('2');
      expect(m2uidl).to.equal('msg_2');
      expect(m3id).to.equal('3');
      expect(m3uidl).to.equal('msg_3');
    })
    // .get(({ account }) => account.closePop3Session())
  );


  it('checks that message does not exist', () =>
    Account.findOne(accountId, 'unsecure')
    .then(account => Message.findOneByUidl('0123456789abcdef0123456789abcdef', account.id))
    .then(message => {
      expect(message).to.be.a('undefined');
    })
  );


  it('fetches account messages', () => {
    let account;
    return Account.findOne(accountId, 'unsecure')
    .then(_account => {
      account = _account;
      return account.fetchRemoteMessages();
    })
    .then(messages => {
      console.log('messages', messages);
      expect(messages.length).to.equal(3);
      const [ m1, m2, m3 ] = messages;
      // expect(m1.id).to.equal(1);
      expect(m1.uidl).to.equal('msg_1');
      // expect(m2.id).to.equal(2);
      expect(m2.uidl).to.equal('msg_2');
      // expect(m3.id).to.equal(3);
      expect(m3.uidl).to.equal('msg_3');
    })
    .then(() => Message.findAll(account.id))
    .then(messages => {
      // console.log(messages);
    })

  });

});