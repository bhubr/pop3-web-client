import React from 'react';
import { users, app } from '../../client/feathers';

console.log('login component', users, app);

export default class Login extends React.Component {
  // https://reactjs.org/docs/forms.html#controlled-components
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    let changedValue = { [name]: value };
    this.setState((prevState, props) => Object.assign(
      { ...prevState }, changedValue
    ));
  }

  handleSubmit(event) {
    event.preventDefault();
    // fetch('/users', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(this.state)
    // });
    console.log({
      ...this.state,
      strategy: 'local'
    }, app);
    app.authenticate({
      ...this.state,
      strategy: 'local'
    }).then(function(result){
      console.log('Authenticated!', result);
    }).catch(function(error){
      console.error('Error authenticating!', error);
    });

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
                    <legend>Login</legend>
                    <div className="col-md-12 form-group">

                      <input
                        className="form-control"
                        placeholder="Email"
                        name="email"
                        type="email"
                        value={this.state.email}
                        onChange={this.handleChange} />
                    </div>

                    <div className="col-md-12 form-group">
                      <input
                        className="form-control"
                        placeholder="Password"
                        name="password"
                        type="password"
                        value={this.state.password}
                        onChange={this.handleChange} />
                    </div>

                  </fieldset>

                  <i className="divider"></i>
                  <button className="btn btn-primary mbtn" style={{ marginLeft: '15px' }}>Login</button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
