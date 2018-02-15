import api from './API';

const fetch = typeof window !== 'undefined' ? window.fetch : global.fetch;

export default class Account {

  static create(accountProps) {
    return api.post('/api/accounts', accountProps);
  }
}