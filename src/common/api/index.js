if (typeof window !== 'undefined') {
  module.exports = require('./api.client');
} else {
  module.exports = require('./api.server');
}
