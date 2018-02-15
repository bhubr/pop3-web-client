import React from 'react';
import validator from '../utils/validator';

export default class LoginRegisterForm extends React.Component {
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
    this.setState((prevState, props) => Object.assign(
      { ...prevState }, changedValues
    ));
  }

  handleSubmit(event) {
    event.preventDefault();

    const { email, password } = this.state;
    this.props.onSubmit({
      email: email.value, password: password.value
    });
  }

  render() {
    const { email, password } = this.state;
    const { title, errorMessage, isPending } = this.props;
    return (
      <div className="pure-u-1">

        <form onSubmit={this.handleSubmit} className="pure-form pure-form-stacked">
            <fieldset>
                <legend>{this.title}</legend>
                {errorMessage ? <div className="alert alert-danger">{errorMessage}</div> : ''}
                {isPending ? <div className="alert alert-loading">LOADING</div> : ''}

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

                <button type="submit" className="pure-button pure-button-primary">{this.title}</button>
            </fieldset>
        </form>

      </div>
    );
  }
}