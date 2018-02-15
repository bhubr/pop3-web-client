const { N3 } = require("./n3");
const { MessageStore } = require("./messagestore");
const markdown = require("node-markdown").Markdown;
const serverName = "fw.node.ee";
const redis = require("redis");
const msgSubscriber = redis.createClient();
const ctrlSubscriber = redis.createClient();

msgSubscriber.on("message", function(channel, message) {
  // console.log("Message '" + message + "' on channel '" + channel + "' arrived!")
});

msgSubscriber.subscribe("mailqueue");
ctrlSubscriber.subscribe("control");

ctrlSubscriber.on("message", function(channel, resp) {
  console.log('received kill message');
  process.exit();
});

// runs after the user is successfully authenticated
MessageStore.prototype.registerHook = function() {

    const self = this;
    msgSubscriber.on("message", function(channel, resp) {
        const { message, subject, toName, toAddress, date } = JSON.parse(resp);

        self.addMessage({
            toName,
            toAddress,
            date,
            subject,
            fromName:       'John Difool',
            fromAddress:    'john.difool@example.com',
            text:           message,
            html:           markdown(message)
        });

    })
    // Add a new message to the users inbox (MessageStore)
}

// Currenlty any user with password "12345" will be authenticated successfully
function AuthStore(user, auth){
    var password;
    if(user){
        password = 12345;
    }
    return auth(password);
}

// Setup servers for both port 110 (standard) and 995 (secure)
console.log('START POP3 SERVER ON PORT 1100');
// listen on standard port 110
N3.startServer(1100, serverName, AuthStore, MessageStore);

// Custom authentication method: FOOBAR <user> <pass>
N3.extendAUTH("FOOBAR",function(authObj){
    var params = authObj.params.split(" "),
        user = params[0],
        pass = params[1];

    if(!user) // username is not set
        return "-ERR Authentication error. FOOBAR expects <user> <password>"

    authObj.user = user;
    return authObj.check(user, pass);
});
