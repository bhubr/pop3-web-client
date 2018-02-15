import React from 'react';
import AccountForm from './AccountForm';
import AccountList from './AccountList';

export default class Accounts extends React.Component {
  render() {
    return (
      <div className="pure-u-1">
        <div className="pure-g">
          <div className="pure-u-1-2">
            <AccountList />
          </div>
          <div className="pure-u-1-2">
            <AccountForm />
          </div>
        </div>
      </div>
    )
  }
}
