import React from 'react';
import { connect } from 'react-redux';
import { loginUser, changeTitle } from '../actions';
import LoginRegisterForm from './LoginRegisterForm';

class Login extends LoginRegisterForm {
  title = 'Sign In';
}

const mapStateToProps = state => {
  return {
    errorMessage: state.session.authenticationError,
    isPending: state.session.isAuthenticating
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeTitle: title => dispatch(changeTitle(title)),
    onSubmit: user => dispatch(loginUser(user))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
