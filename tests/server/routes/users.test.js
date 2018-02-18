const chai = require('chai');
const expect = chai.expect;
const Promise = require('bluebird');
const { spawn } = require('child_process');
const request = require('request-promise');
const path = require('path');
const clearDatabase = require('../../_utils/clearDatabase');
const { getId, getEmail, getCredentials } = require('../../_utils/getCredentials');

let child;

function passLog(label) {
  return v => {
    console.log('\n\n######\\\\\\#\n#', label, '\n', v);
    return v;
  }
}

function timeoutPromise() {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(true), 1000);
    });
}

function startServer() {
  child = spawn('node', [path.normalize(__dirname + '/../../../dist/app')]);

  // child.stdout.on('data', (data) => {
  //   console.log(`stdout: ${data}`);
  // });

  // child.stderr.on('data', (data) => {
  //   console.log(`stderr: ${data}`);
  // });

  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  return timeoutPromise();
}

function killServer() {
  child = spawn('killall', ['node']);
}

function createUser(credentials) {
  return request({
    method: 'POST',
    uri: 'http://localhost:3001/api/users',
    body: credentials,
    json: true // Automatically stringifies the body to JSON
  });
}

function authenticateUser(credentials) {
  return request({
    method: 'POST',
    uri: 'http://localhost:3001/api/authentication',
    body: credentials,
    json: true,
    resolveWithFullResponse: true
  });
}

function extractCookieHeader(response) {
  return response.headers['set-cookie'] ?
    response.headers['set-cookie'][0] : '';
}

describe('/api/users routes', () => {

  const credentials1 = getCredentials();
  let user1;

  before(() => clearDatabase()
    .then(() => startServer())
  );

  after(killServer);

  it('tests user creation route', () =>
    createUser(credentials1)
    .then(res => {
      user1 = res;
      expect(user1).to.be.a('object');
      expect(user1.id).to.equal(1);
      expect(user1.email).to.equal('test.user.1@example.com');
      expect(user1.password).to.be.a('undefined');
    })
  );

  it('tests user creation and auth / OK', () => {
    const credentials = getCredentials();
    return createUser(credentials)
    .then(() => authenticateUser(credentials))
    .then(res => {
      const user = res.body;
      expect(res.statusCode).to.equal(200);
      expect(user).to.be.a('object');
      expect(user.id).to.equal(2);
      expect(user.email).to.equal('test.user.2@example.com');
      expect(user.password).to.be.a('undefined');
    })
  });

  it('tests user creation and auth / NOK', () => {
    const credentials = getCredentials();
    return createUser(credentials)
    .then(() => authenticateUser({
      email: credentials.email, password: 'Wrong!!!'
    }))
    .then(res => {
      expect(false).to.equal(true);
    })
    .catch(err => {
      const { response } = err;
      const { body } = response;
      expect(response.statusCode).to.equal(401);
      expect(body).to.be.a('object');
      expect(body.error).to.equal('Authentication failure: bad credentials');
    })
  });

  it('tests user update route / OK: user IS connected', () =>

    authenticateUser(credentials1)
    .then(extractCookieHeader)
    .then(cookie =>
      request({
        method: 'PATCH',
        uri: `http://localhost:3001/api/users/${user1.id}`,
        body: { email: 'foo@bar.org', password: 'someotherpass' },
        headers: {
          cookie
        },
        json: true,
        resolveWithFullResponse: true
      })
    )
    .then(response => {
      expect(response.statusCode).to.equal(200);
    })

  );

  it('tests user update route / NOK: WRONG user connected', () =>

    authenticateUser({
      email: 'foo@bar.org', password: 'someotherpass'
    })
    .then(extractCookieHeader)
    .then(cookie =>
      request({
        method: 'PATCH',
        uri: `http://localhost:3001/api/users/2`,
        body: { email: 'foo@bar.org', password: 'someotherpass' },
        headers: {
          cookie
        },
        json: true,
        resolveWithFullResponse: true
      })
    )
    .then(res => {
      expect(false).to.equal(true);
    })
    .catch(err => {
      const { response } = err;
      const { body } = response;
      expect(response.statusCode).to.equal(403);
      expect(body).to.be.a('object');
      expect(body.error).to.equal('Operation not permitted');
    })

  );

  it('tests user update route / NOK: user NOT connected', () =>
    request({
      method: 'PATCH',
      uri: `http://localhost:3001/api/users/${user1.id}`,
      body: { email: 'foo@bar.org', password: 'someotherpass' },
      json: true,
      resolveWithFullResponse: true
    })
    .then(res => {
      expect(false).to.equal(true);
    })
    .catch(err => {
      const { response } = err;
      const { body } = response;
      expect(response.statusCode).to.equal(401);
      expect(body).to.be.a('object');
      expect(body.error).to.equal('Not logged-in');
    })
  );


});