import React from 'react';
import ReactDOM from 'react-dom';
import MyApp from '../common/components/MyApp';
import {
  BrowserRouter
} from 'react-router-dom';
import { Provider } from 'react-redux';
import initStore from '../common/initStore';
import api from '../common/api';
import clientAPI from './clientAPI';
api.setStrategy(clientAPI);

const mountNode = document.getElementById('app');

const initialState = {};
const store = initStore(initialState);

const MyRoutedApp = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <MyApp />
      </BrowserRouter>
    </Provider>
  );
};

ReactDOM.render(<MyRoutedApp />, mountNode);
