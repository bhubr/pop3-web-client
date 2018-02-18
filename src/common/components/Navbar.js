import React from 'react';
import {
  Link
} from 'react-router-dom';
import { logoutUser } from '../actions';
import { connect } from 'react-redux';

function LinkItem(props) {
  return (
    <li><Link to={props.href}>{props.label}</Link></li>
  );
}

class RightMenuLoggedIn extends React.Component {
  render() {
    return (
      <ul id="nav-mobile" className="right hide-on-med-and-down">
        <li><Link to="/accounts">Accounts</Link></li>
        <li><Link to="/profile">{this.props.email}</Link></li>
        <li><a href="#0" onClick={this.props.logout}>Logout</a></li>
      </ul>
    );
  }
}

class RightMenuGuest extends React.Component {
  render() {
    return (
      <ul id="nav-mobile" className="right hide-on-med-and-down">
        <li><Link to="/about">About</Link></li>
        <li><Link to="/signin">Sign in</Link></li>
        <li><Link to="/signup">Sign up</Link></li>
      </ul>
    );
  }
}

class Navbar extends React.Component {
  render() {
    const { user } = this.props;
    const rightMenu = user ?
      <RightMenuLoggedIn email={user.email} logout={this.props.onLogout} /> :
      <RightMenuGuest />;

    return (
      <nav>
        <div className="nav-wrapper">
          <Link to="/" className="brand-logo" style={{paddingLeft: '15px'}}>Webmail</Link>
          {rightMenu}
        </div>
      </nav>
    );
  }
}

export default connect(
  (state) => ({
    user: state.session.user
  }),
  {
    onLogout: event => {
      event.preventDefault();
      dispatch(logoutUser());
    }
  }
)(Navbar);