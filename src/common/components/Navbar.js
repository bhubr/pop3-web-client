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
      <ul className="nav navbar-nav pull-right">
        <li><Link to="/profile">{this.props.email}</Link></li>
        <li><a href="#0" onClick={this.props.logout}>Logout</a></li>
      </ul>
    );
  }
}

class RightMenuGuest extends React.Component {
  render() {
    return (
      <ul className="nav navbar-nav pull-right">
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
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
    //
    // const menuItems = rightMenu.map((link, index) => (
    //   <LinkItem key={index} href={link.href} label={link.label} onClick={link.onClick} />
    // ));
    // key={index.toString()}
    //  (
    //   <li><a href="/profile/">{this.props.user.email}</a></li>
    // ) : (
    //   <li><a href="/login/">Login</a></li>
    //   <li><a href="/register/">Register</a></li>
    // );
    return (
      <nav className="navbar navbar-default">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
              <span className="sr-only">Toggle Navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link to="/" className="navbar-brand">Swatch it!</Link>
          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li><a href="/brands">Brands</a></li>
              <li><a href="/courses">Courses</a></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
            <ul className="nav navbar-nav pull-right">
              {rightMenu}
            </ul>
          </div>
        </div>
      </nav>
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
    // onLogin: () => dispatch(loginUser({ email: 'jonsnow.tv' })),
    onLogout: event => {
      event.preventDefault();
      dispatch(logoutUser());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
