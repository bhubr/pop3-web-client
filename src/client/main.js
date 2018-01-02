import React from 'react';
import ReactDOM from 'react-dom';
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
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>

      <hr/>

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
