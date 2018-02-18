const getId = (() => {
  let id = 0;
  return () => (++id);
})();

function getEmail() {
  return 'test.user.' + getId() + '@example.com';
}

function getCredentials(password) {
  password = password || 'unsecure';
  return {
    email: getEmail(),
    password
  }
}

module.exports = { getId, getEmail, getCredentials };