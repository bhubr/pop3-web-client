import React from 'react';
import { registerUser } from '../actions';
import { connect } from 'react-redux';

class Register extends React.Component {
  // https://reactjs.org/docs/forms.html#controlled-components
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirm: '',
      passwordsMatch: true
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkPasswordsMatch = this.checkPasswordsMatch.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    let changedValues = { [name]: value };
    if(name.startsWith('password')) {
      changedValues.passwordsMatch = this.checkPasswordsMatch(name, value);
    }
    this.setState((prevState, props) => Object.assign(
      { ...prevState }, changedValues
    ));
  }

  checkPasswordsMatch(name, value) {
    const checkAgainst = name === 'password' ? 'passwordConfirm' : 'password';
    console.log('check', name, checkAgainst, this.state[checkAgainst] === value);
    return this.state[checkAgainst] === value;
  }

  handleSubmit(event) {
    event.preventDefault();
    if(! this.state.passwordsMatch) {
      return;
    }
    this.props.registerUser(this.state);
  }

  render() {
    return (
      <div className="container">
        <section className="row">
          <div className="col-md-6 col-md-offset-3">
            <div className="panel panel-default">
              <div className="panel-body">
                <form onSubmit={this.handleSubmit} role="form">
                  <fieldset>
                    <legend>Register</legend>
                    <div className="col-md-12 form-group">
                      <input
                        className="form-control"
                        placeholder="First name"
                        name="firstName"
                        type="text"
                        value={this.state.firstName}
                        onChange={this.handleChange} />
                    </div>

                    <div className="col-md-12 form-group">
                      <input
                        className="form-control"
                        placeholder="Last name"
                        name="lastName"
                        type="text"
                        value={this.state.lastName}
                        onChange={this.handleChange} />
                    </div>

                    <div className="col-md-12 form-group">
                      <input
                        className="form-control"
                        placeholder="Email"
                        name="email"
                        type="email"
                        value={this.state.email}
                        onChange={this.handleChange} />
                    </div>

                    <div className={'col-md-12 form-group ' + (this.state.passwordsMatch ? '' : 'has-error')}>
                      <input
                        className="form-control"
                        placeholder="Password"
                        name="password"
                        type="password"
                        value={this.state.password}
                        onChange={this.handleChange} />
                    </div>

                    <div className={'col-md-12 form-group ' + (this.state.passwordsMatch ? '' : 'has-error')}>
                      <input
                        className="form-control"
                        placeholder="Password"
                        name="passwordConfirm"
                        type="password"
                        value={this.state.passwordConfirm}
                        onChange={this.handleChange} />
                    </div>
                  </fieldset>

                  <i className="divider"></i>
                  <button className="btn btn-primary mbtn" style={{ marginLeft: '15px' }}>Join</button>
                </form>
              </div>
            </div>
          </div>
        </section>
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
    registerUser: user => dispatch(registerUser(user))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
