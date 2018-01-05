import React from 'react';
// import simpleAuth from '../../common/simpleAuth';
import {
  Route,
  Redirect,
  withRouter
} from 'react-router-dom';
import { connect } from 'react-redux';

// <Redirect to={{
//   pathname: '/login',
//   state: { from: props.location }
// }}/>
// const PrivateRoute = ({ component: Component, ...rest }) => {
//   console.log('PrivateRoute', rest, this);
//   return (
//     <Route {...rest} render={props => (
//       <Component {...props}/>
//     )}/>
//   );
// };

class PrivateRoute extends React.Component {
  render() {
    const { component: Component, user, ...rest } = this.props;
    console.log('PrivateRoute', arguments, this, Component, user, rest);
    return (
      user ? (
        <Route {...rest} render={props => (
          <Component {...props}/>
        )}/>
      ) : (
        <Redirect to={{
          pathname: '/login',
          state: { from: this.props.location }
        }}/>
      )
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.session.user
  };
};

export default connect(mapStateToProps)(PrivateRoute);
