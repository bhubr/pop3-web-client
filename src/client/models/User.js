const fetch = typeof window !== 'undefined' ? window.fetch : global.fetch;

export default class User {
  
  static findOne(id) {

    return fetch(`/api/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
    .then(response => response.json());

  }
  
  static findAll() {

    return fetch(`/api/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
    .then(response => response.json());

  }

  static create(user) {

    return fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(user)
    })
    .then(response => response.json());
  }
  
  static delete(id) {

    return fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
    .then(response => response.json());

  }
}