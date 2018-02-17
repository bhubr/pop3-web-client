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
      <nav>
        <div className="nav-wrapper">
          <a href="#" className="brand-logo">Logo</a>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li><a href="sass.html">Sass</a></li>
            <li><a href="badges.html">Components</a></li>
            <li><a href="collapsible.html">JavaScript</a></li>
          </ul>
        </div>
      </nav>
    );
    // return (
    // <div id="nav" className="pure-u">
    //     <a href="#" className="nav-menu-button">Menu</a>

    //     <div className="nav-inner">
    //         <button className="primary-button pure-button">Compose</button>

    //         <div className="pure-menu">
    //             <ul className="pure-menu-list">
    //                 <li className="pure-menu-item"><a href="#" className="pure-menu-link">Inbox <span className="email-count">(2)</span></a></li>
    //                 <li className="pure-menu-item"><a href="#" className="pure-menu-link">Important</a></li>
    //                 <li className="pure-menu-item"><a href="#" className="pure-menu-link">Sent</a></li>
    //                 <li className="pure-menu-item"><a href="#" className="pure-menu-link">Drafts</a></li>
    //                 <li className="pure-menu-item"><a href="#" className="pure-menu-link">Trash</a></li>
    //                 <li className="pure-menu-heading">Labels</li>
    //                 <li className="pure-menu-item"><a href="#" className="pure-menu-link"><span className="email-label-personal"></span>Personal</a></li>
    //                 <li className="pure-menu-item"><a href="#" className="pure-menu-link"><span className="email-label-work"></span>Work</a></li>
    //                 <li className="pure-menu-item"><a href="#" className="pure-menu-link"><span className="email-label-travel"></span>Travel</a></li>
    //             </ul>
    //         </div>
    //     </div>
    // </div>
    // );
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
