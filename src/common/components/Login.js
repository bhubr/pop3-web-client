import React from 'react';
import { loginUser } from '../actions';
import { connect } from 'react-redux';
import validator from '../utils/validator';

class Login extends React.Component {
  // https://reactjs.org/docs/forms.html#controlled-components
  constructor(props) {
    super(props);
    this.state = {
      email: {
        value: '', isValid: true, validErrMsg: ''
      },
      password:  {
        value: '', isValid: true, validErrMsg: ''
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    const [ isValid, validErrMsg ] = validator.validate(name, value);

    let changedValues = { [name]: { value, isValid, validErrMsg } };
    console.log('Validate', name, value, );
    // if(name.startsWith('password')) {
    //   changedValues.passwordsMatch = this.checkPasswordsMatch(name, value);
    // }
    this.setState((prevState, props) => Object.assign(
      { ...prevState }, changedValues
    ));
  }

  // checkPasswordsMatch(name, value) {
  //   const checkAgainst = name === 'password' ? 'passwordConfirm' : 'password';
  //   console.log('check', name, checkAgainst, this.state[checkAgainst] === value);
  //   return this.state[checkAgainst] === value;
  // }

  handleSubmit(event) {
    event.preventDefault();
    // if(! this.state.passwordsMatch) {
    //   return;
    // }
    const { email, password } = this.state;
    this.props.loginUser({
      email: email.value, password: password.value
    });
  }

  render() {
    const { email, password } = this.state;
    return (
      <div className="pure-u-1">

        <form onSubmit={this.handleSubmit} className="pure-form pure-form-stacked">
            <fieldset>
                <legend>Sign in</legend>

                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={"form-control " + (email.isValid ? 'valid-input' : 'invalid-input')}
                  placeholder="Email"
                  value={email.value}
                  onChange={this.handleChange} />
                {email.isValid ? '' : <span className="invalid-text pure-form-message">{email.validErrMsg}</span>}

                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={"form-control " + (password.isValid ? 'valid-input' : 'invalid-input')}
                  placeholder="Password"
                  value={password.value}
                  onChange={this.handleChange} />
                {password.isValid ? '' : <span className="invalid-text pure-form-message">{password.validErrMsg}</span>}

                <button type="submit" className="pure-button pure-button-primary">Sign in</button>
            </fieldset>
        </form>

      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    errorMessage: state.users.registerError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loginUser: user => dispatch(loginUser(user))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
