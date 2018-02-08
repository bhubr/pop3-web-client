import React from 'react';
import { loginUser } from '../actions';
import { connect } from 'react-redux';

class Login extends React.Component {
  // https://reactjs.org/docs/forms.html#controlled-components
  constructor(props) {
    super(props);
    this.state = {
      // firstName: '',
      // lastName: '',
      email: '',
      password: '',
      // passwordConfirm: '',
      // passwordsMatch: true
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    let changedValues = { [name]: value };
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
    console.log(this.state);
    this.props.loginUser(this.state);
  }

  render() {
    return (
      <div className="pure-u-1">

        <form onSubmit={this.handleSubmit} className="pure-form pure-form-stacked">
            <fieldset>
                <legend>Sign up</legend>

                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={this.handleChange} />
                <span className="pure-form-message">This is a required field.</span>

                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.handleChange} />

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
