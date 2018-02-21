var POP3Server = require('pop-server');
var MailComposer = require('nodemailer/lib/mail-composer');

var PORT = 1100;

var uids = ['msg_1', 'msg_2', 'msg_3'];
pop3Server = new POP3Server({
  auth: function(user, checkPassword) {
    var password = false;
    if (user === 'jdoe' || user === 'jdoe2') {
      password = 'ok';
    }
    return checkPassword(password);
  },
  store: {
    register: function(cb) {
      console.log('register', this.user);
      if (this.user === "jdoe") {
        var self = this;
        uids.forEach(function(uid) {
          self.addMessage(uid, 40);
        });
      }
      cb();
    },
    read: function(uid, cb) {
      var mail = new MailComposer({
        from: 'me <me@example.net',
        to: 'you <you@example.net>',
        subject: 'hi there',
        text: 'hi ! how are u?',
        html: 'hi ! how are u? <b>hugs</b>'
      });
      mail.compile().build(cb);
    },
    removeDeleted: function(deleted, cb) {
      deleted.forEach(function(uid) {
        var index = uids.indexOf(uid);
        if (index > -1) {
          uids.splice(index, 1);
        }
      });
      cb();
    }
  }
});
pop3Server.listen(PORT, function(err) {
  if (err) {
    return done(err);
  }
  console.log('server listening');
  // pop3Server.listenSSL(SSL_PORT, done);
});
