import api from './API';

const fetch = typeof window !== 'undefined' ? window.fetch : global.fetch;

export default class Account {

  static create(accountProps) {
    return api.post('/api/accounts', accountProps);
  }

  static findAll(userId) {
    return api.get('/api/accounts?userId=' + userId);
  }
}