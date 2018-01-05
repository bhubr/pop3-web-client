import React from 'react';
// import simpleAuth from '../../common/simpleAuth';
import {
  Route,
  Redirect
} from 'react-router-dom';

// simpleAuth.user ? (
//   <Component {...props}/>
// ) : (
//   <Redirect to={{
//     pathname: '/login',
//     state: { from: props.location }
//   }}/>

// <Redirect to={{
//   pathname: '/login',
//   state: { from: props.location }
// }}/>
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    <Component {...props}/>
  )}/>
);

export default PrivateRoute;
