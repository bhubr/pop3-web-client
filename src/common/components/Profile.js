import React from 'react';
// import simpleAuth from '../../common/simpleAuth';
import { connect } from 'react-redux';
import {
  updateUser
} from '../actions';

class Profile extends React.Component {
  // https://reactjs.org/docs/forms.html#controlled-components
  constructor(props) {
    super(props);
    const {
      id,
      firstName,
      lastName,
      email
    } = this.props.user;
    this.state = { id, firstName, lastName, email };
    console.log('Profile state', this.state);

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
    console.log('submit profile', {
      ...this.state
    });
    this.props.updateUser(this.state);

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
                    <legend>Profile</legend>

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
                  <button className="btn btn-primary mbtn" style={{ marginLeft: '15px' }}>Update profile</button>
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
    user: state.session.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateUser: props => dispatch(updateUser(props))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
