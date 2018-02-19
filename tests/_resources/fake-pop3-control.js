const path = require('path');
const { spawn } = require('child_process');
const timeoutPromise = require('../_utils/timeoutPromise');

module.exports = (function() {
  let pid;

  function killPop3Server() {
    const child = spawn('kill', ['-9', '' + pid]);
    return timeoutPromise(500);
  }

  function startPop3Server() {
    const child = spawn('node', [path.normalize(__dirname + '/fake-pop3-server')]);
    pid = child.pid;
    console.log('child process pid', pid);

    // child.stdout.on('data', (data) => {
    //   console.log(`stdout: ${data}`);
    // });

    child.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    child.on('close', (code) => {
      if(code != null) {
        console.error(`PROBABLE ERROR: child process exited with code ${code}`);
        process.exit();
      }
    });


    return timeoutPromise();
  }

  return { startPop3Server, killPop3Server };
  
})();