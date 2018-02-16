import api from './API';

const fetch = typeof window !== 'undefined' ? window.fetch : global.fetch;

export default class Message {

  static openInbox(accountId, userPass) {
    return api.post('/api/inbox/' + accountId, { userPass });
  }

  static findAll(accountId) {
    return api.get('/api/messages/?accountId=' + accountId);
  }

  static findByUidl(accountId, uidl) {
    return api.get(`/api/messages/?accountId=${accountId}&uidl=${uidl}`)
    .then(messages => (messages[0]));
  }
}