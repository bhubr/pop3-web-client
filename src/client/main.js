import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from '../common/components/Navbar';
import Register from '../common/components/Register';
import Login from '../common/components/Login';
import Profile from '../common/components/Profile';
import simpleAuth from './simpleAuth';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Link
} from 'react-router-dom';

const MyApp = () => (
  <Router>
    <div>
      <Navbar user={{email:'joe@foo.bar'}}/>

      <Route exact path="/" component={Home}/>
      <Route path="/register" component={Register}/>
      <Route path="/login" component={Login}/>
      <PrivateRoute path="/profile" component={Profile}/>
    </div>
  </Router>
);

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);


const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    simpleAuth.user ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
);

var mountNode = document.getElementById('app');
ReactDOM.render(<MyApp />, mountNode);
