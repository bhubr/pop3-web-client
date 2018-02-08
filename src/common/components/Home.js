import React from 'react';
import {
  Link
} from 'react-router-dom'

export default class Home extends React.Component {

  render() {
    return (
      <div className="pure-u-1">
        <h1>Home</h1>
        <ul>
          <li><Link to="/signup">Sign up</Link></li>
          <li><Link to="/signin">Sign in</Link></li>
        </ul>
      </div>
    );

  }
}