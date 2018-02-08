import React from 'react';
import ReactDOM from 'react-dom';
import MyApp from '../common/components/MyApp';
import {
  Router
} from 'react-router-dom';
import { Provider } from 'react-redux';
import initStore from '../common/initStore';
import api from '../common/api';
import history from '../common/history';
import clientAPI from './clientAPI';
api.setStrategy(clientAPI);

const mountNode = document.getElementById('app');

const state = window.initialState || {};
console.log('CLIENT initialState', window.initialState);
const store = initStore(state);

const MyRoutedApp = () => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <MyApp />
      </Router>
    </Provider>
  );
};

ReactDOM.render(<MyRoutedApp />, mountNode);
