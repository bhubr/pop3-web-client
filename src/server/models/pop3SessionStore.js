class Pop3SessionStore {

  sessions = {};

  get(accountId) {
    // console.log('Pop3SessionStore.get', this, accountId, Object.keys(this.sessions), this.sessions[accountId]);
    return this.sessions[accountId] === undefined ? null :
      this.sessions[accountId];
  }

  set(accountId, pop3) {
    this.sessions[accountId] = pop3;
    // console.log('Pop3SessionStore.get', accountId, Object.keys(this.sessions), this.sessions[accountId]);
  }

  unset(accountId) {
    delete this.sessions[accountId];
  }
}

export default new Pop3SessionStore();