import api from './API';

const fetch = typeof window !== 'undefined' ? window.fetch : global.fetch;

export default class Message {

  static openInbox(accountId, userPass) {
    return api.post('/api/inbox/' + accountId, { userPass });
  }
}