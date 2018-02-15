import React from 'react';
import { connect } from 'react-redux';
import { loginUser } from '../actions';
import LoginRegisterForm from './LoginRegisterForm';

class Login extends LoginRegisterForm {
  title = 'Sign In';
}

const mapStateToProps = state => {
  return {
    errorMessage: state.session.authenticationError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSubmit: user => dispatch(loginUser(user))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
