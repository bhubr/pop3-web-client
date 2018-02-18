const chai = require('chai');
const expect = chai.expect;
const Promise = require('bluebird');
const { spawn } = require('child_process');
const request = require('request-promise');
const path = require('path');
const { getId, getEmail, getCredentials } = require('../../_utils/getCredentials');

let child;

function startServer() {
  child = spawn('node', [path.normalize(__dirname + '/../../../dist/app')]);

  child.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  child.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  return Promise.resolve(true);
}


describe('/api/users routes', () => {

  before(() => startServer());

  it('tests user creation route', () =>
    request({
      method: 'POST',
      uri: 'http://localhost:3001/api/users',
      body: getCredentials(),
      json: true // Automatically stringifies the body to JSON
    })
    .then(res => {
      console.log(res);
    })
  );

});