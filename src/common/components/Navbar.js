import React from 'react';
import {
  Link
} from 'react-router-dom';

function LinkItem(props) {
  return (
    <li><Link to={props.href}>{props.label}</Link></li>
  );
}

export default class Navbar extends React.Component {
  render() {
    const { user } = this.props;
    const rightMenu = user ? [
      { href: '/profile', label: user.email }
    ] : [
      { href: '/login', label: 'Login' },
      { href: '/register', label: 'Register' }
    ];
    const menuItems = rightMenu.map((link, index) => (
      <LinkItem key={index} href={link.href} label={link.label} />
    ));
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
            <a className="navbar-brand" href="/">Swatch it!</a>
          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li><a href="/brands">Brands</a></li>
              <li><a href="/courses">Courses</a></li>
            </ul>
            <ul className="nav navbar-nav pull-right">
              {menuItems}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
