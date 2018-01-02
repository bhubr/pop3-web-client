import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from '../common/components/Navbar';
import Register from '../common/components/Register';
import Login from '../common/components/Login';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

const MyApp = () => (
  <Router>
    <div>
      <Navbar user={{email:'joe@foo.bar'}}/>

      <Route exact path="/" component={Home}/>
      <Route path="/register" component={Register}/>
      <Route path="/login" component={Login}/>
    </div>
  </Router>
);

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);


var mountNode = document.getElementById('app');
ReactDOM.render(<MyApp />, mountNode);
