import CryptoJS from 'crypto-js';
const configFile = process.env.NODE_ENV !== 'test' ? 'config' : 'config.test';
const { salt } = require('../' + configFile);


function encrypt(text, password) {
  const ciphertext = CryptoJS.AES.encrypt(salt + text, password);
  return ciphertext.toString();
}
 
function decrypt(ciphertext, password) {
  const bytes = CryptoJS.AES.decrypt(ciphertext.toString(), password);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  console.log('decrypt', decrypted, decrypted.length, salt.length, password);
  return decrypted.substr(salt.length);
}

function isInt(maybeInt) {
  return maybeInt === parseInt(maybeInt, 10);
}

export { encrypt, decrypt, isInt }