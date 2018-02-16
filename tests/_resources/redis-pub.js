const redis = require("redis");
const publisher  = redis.createClient();


function createEmail(index, toName, toAddress) {
  const date = new Date('2018-01-01').getTime() + (index * 1000);
  // console.log('createEmail', date);
  const email = {
    subject: 'Test Message #' + index,
    message: `#Hi ${toName}!\nIt works!`,
    toName,
    toAddress,
    date
  };
  return new Promise((resolve, reject) => {
    // console.log("mailqueue", JSON.stringify(email));
    publisher.publish("mailqueue", JSON.stringify(email));
    setTimeout(() => {
      resolve(true);
    }, 200);
  });
}

function killServer() {
  publisher.publish('control', '');
}

module.exports = {
  createEmail, killServer
};