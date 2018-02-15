class API {
  headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }

  sendRequest(url, method, body) {
    return fetch(url, {
      method,
      credentials: 'include',
      headers: this.headers,
      body
    })
    .then(response => {
      return response.json()
      .then(json => {
        if(! response.ok) {
          console.error('RESPONSE NOT OK, THROWING', json, json.error);
          throw new Error(json.error);
        }
        // console.log('######## sendRequest cookies', response.headers, response.headers.get('set-cookie'));
        // // Display the keys
        // for(var key of response.headers.keys()) {
        //    console.log(key);
        // }
        // if(response.headers.get('set-cookie')) {
        //   document.cookie = response.headers.get('set-cookie');
        // }
        return json;
      });
    });
  }

  get(url) {
    return this.sendRequest(url, 'GET');
  }

  post(url, data) {
    return this.sendRequest(
      url, 'POST', JSON.stringify(data)
    );
  }
}

export default new API();