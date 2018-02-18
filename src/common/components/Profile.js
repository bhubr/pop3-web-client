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
    this.state = { id, email, password: '' };
    console.log('Profile state', this.state);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    console.log('handleChange', name, value);
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
      <div className="row">

        <div className="col s6">
          <div className="row">

          <form onSubmit={this.handleSubmit} className="col s12">
            <h1>Account data</h1>

            {/*<div className="row">
              <div className="input-field col s12">
                <input
                  className="validate"
                  placeholder="First name"
                  name="firstName"
                  type="text"
                  value={this.state.firstName}
                  onChange={this.handleChange} />
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <input
                  className="validate"
                  placeholder="Last name"
                  name="lastName"
                  type="text"
                  value={this.state.lastName}
                  onChange={this.handleChange} />
              </div>
            </div>*/}

            <div className="row">
              <div className="input-field col s12">
                <input
                  className="form-control"
                  placeholder="Email"
                  name="email"
                  type="email"
                  value={this.state.email}
                  onChange={this.handleChange} />
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
              <input
                className="form-control"
                placeholder="Password"
                name="password"
                type="password"
                value={this.state.password}
                onChange={this.handleChange} />
              </div>
            </div>


            <button type="submit" className="col s12 btn btn-large waves-effect indigo">Update profile</button>
          </form>
          </div>
        </div>
        <div className="col s6">
        </div>
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
