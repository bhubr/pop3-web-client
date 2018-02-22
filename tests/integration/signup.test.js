"use strict"
const chai        = require('chai');
const expect      = chai.expect;
const webdriverio = require('webdriverio');
// const url         = require('./url');
const Promise     = require('bluebird');
const {
  getId,
  getEmail
} = require('../_utils/getCredentials');
const clearDatabase = require('../_utils/clearDatabase');

const baseUrl     = 'http://localhost:3001';

function url(relative) {
  return baseUrl + relative;
}

let client;

describe("Integration tests", function() {

  before(() =>
    clearDatabase()
    .then(() => {
      console.log('starting webdriverio client')
      client = webdriverio.remote({ desiredCapabilities: {browserName: 'firefox'} });
      return client.init();
    })
    // .then(utils.passLog('after webdriverio init'))
    // .then(() => done())
    .catch(err => {
      console.log('ABORT because of error:', err);
      process.exit(1);
    })
  );

  after(() => client.end());

  describe('Sign-up and sign-in test', function() {
    const email = getEmail();
    const password = 'Pass4@';

    it('signs up', () =>
      client
      .url(url('/signup'))
      .setValue('input[name="email"]', email)
      .setValue('input[name="password"]', password)
      .click('button[type="submit"]')
      .pause(1000)
      .then(() => client.getUrl())
      .then(url => expect(url).to.equal('http://localhost:3001/profile'))
      .then(() => client.getTitle())
      .then(title => expect(title).to.equal('Email'))
    );

    it('sets up an account', () =>
      client
      // .url(url('/accounts'))
      .click('a[href="/accounts"]')
      .setValue('input[name="type"]', 'POP3')
      .setValue('input[name="host"]', 'localhost')
      .setValue('input[name="port"]', '1100')
      .setValue('input[name="identifier"]', 'jdoe')
      .setValue('input[name="password"]', 'ok')
      .click('button[type="submit"]')
      .pause(1000)
    );

    it('opens an inbox', () =>
      client
      .click('a[href="/inbox/1"]')
      .pause(10000)
    );
  });

});