import React from 'react';
import AccountForm from './AccountForm';
import AccountList from './AccountList';

export default class Accounts extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="col s6">
          <AccountList />
        </div>
        <div className="col s6">
          <AccountForm />
        </div>
      </div>
    )
  }
}
