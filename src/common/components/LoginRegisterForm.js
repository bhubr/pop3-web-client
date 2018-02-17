import React from 'react';
import validator from '../utils/validator';

export default class LoginRegisterForm extends React.Component {
  // https://reactjs.org/docs/forms.html#controlled-components
  constructor(props) {
    super(props);
    this.state = {
      email: {
        value: '', isValid: false, validErrMsg: ''
      },
      password:  {
        value: '', isValid: false, validErrMsg: ''
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
    console.log(this.props);
    const mainStyles = {
      height: '100vh',
      background: 'repeat url("/img/mp-01.png")'
    };
    const overlayStyles = {
      paddingTop: '10%',
      height: '100vh',
      background: 'rgba(255, 255, 255, 0.3)'
    };
    const formStyles = {
      padding: '32px 64px 16px 64px',
      border: '1px solid #eee',
      maxWidth: '450px',
      margin: '0 auto'
    };
    return (
      <main style={mainStyles}>
          <div style={overlayStyles}>

          <div className="z-depth-1 grey lighten-4 row" style={formStyles}>
            <h5 className="indigo-text">Please, login into your account</h5>
            {errorMessage ? <div class="card-panel red lighten-4">{errorMessage}</div> : ''}
            {isPending ? <div className="card-panel blue lighten-4">LOADING</div> : ''}

            <form onSubmit={this.handleSubmit} className="col s12" method="POST">
              <div className="row">
                <div className="col s12">
                </div>
              </div>

              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={"validate " + (email.value ? (email.isValid ? 'valid' : 'invalid') : '')}
                    value={email.value}
                    onChange={this.handleChange} />
                  {email.isValid ? '' : <span className="invalid-text pure-form-message">{email.validErrMsg}</span>}
                  <label htmlFor="email">Enter your email</label>

                </div>
              </div>

              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className={"validate " + (password.value ? (password.isValid ? 'valid' : 'invalid') : '')}
                    value={password.value}
                    onChange={this.handleChange} />
                  {password.isValid ? '' : <span className="invalid-text pure-form-message">{password.validErrMsg}</span>}
                  <label htmlFor="password">Enter your password</label>
                </div>
                <label style={{float: 'right'}}>
                  <a className="pink-text" href="#!"><b>Forgot Password?</b></a>
                </label>
              </div>

              <div className="row">
                <button type="submit" name="btn-login" className="col s12 btn btn-large waves-effect indigo">{this.title}</button>
              </div>

            </form>
          </div>

        </div>
      </main>

    );
  }
}