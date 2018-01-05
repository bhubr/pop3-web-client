// if (typeof window !== 'undefined') {
//   module.exports = require('./api.client');
// } else {
//   module.exports = require('./api.server');
// }

class API {
  setStrategy(strategy) {
    this.strategy = strategy;
  }

  call(action, ...actionArgs) {
    const which = typeof window !== 'undefined' ? 'CLIENT ' : 'SERVER';
    console.log(`API CALL ${which}`, action, actionArgs);
    return this.strategy[action](actionArgs);
  }
}

const api = new API();
export default api;
