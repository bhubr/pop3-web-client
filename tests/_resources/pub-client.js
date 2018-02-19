const Promise = require('bluebird');
const createEmail = require('./redis-pub').createEmail;

const numEmails = process.argv.length > 2 ? parseInt(process.argv[2]) : 1;
console.log('numEmails', numEmails);
const promises = [];

for(let n = 0 ; n < numEmails ; n++) {
  promises.push(
    createEmail(n, 'Ben Hubert', 'benoithubert@gmail.com')
  );
}

Promise.all(promises)
.then(data => {
  console.log(data.length, 'emails created');
  process.exit();
});