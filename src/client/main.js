import React from 'react';
import ReactDOM from 'react-dom';
import MyApp from '../common/components/MyApp';
import {
  BrowserRouter
} from 'react-router-dom';
var mountNode = document.getElementById('app');

const MyRoutedApp = () => {
  return (
    <BrowserRouter>
      <MyApp />
    </BrowserRouter>
  );
};

ReactDOM.render(<MyRoutedApp />, mountNode);
