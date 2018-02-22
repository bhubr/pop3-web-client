import React from 'react';
import { fetchUserAccounts } from '../actions';
import { connect } from 'react-redux';
import {
  Link
} from 'react-router-dom';

class AccountItem extends React.Component {
	render() {
		const { identifier, host, port, id } = this.props.account;
		return (
        <li className="collection-item">
          <Link to={"/inbox/" + id}>{identifier}@{host}{port ? ':' + port : ''}</Link>
        </li>
		);
	}
}

//    { accounts.map(a => <AccountItem key={a.id} account={a} />) }


class AccountList extends React.Component {

	render() {
		const { accounts } = this.props;
    console.log(accounts);
    // var accountItems = accounts.map(a =>
    //   ('<li>' + a.identifier + '@' + a.host + '</li>')
    // );
    // var acntStr = accountItems.join('');
    const accountItems = accounts.map(a => (
      <AccountItem key={a.id} account={a} />
    ));
		return (
      <ul id="account-list" className="collection">
      {accounts && accounts.length ? accountItems : ''}
      </ul>
    );
	}

	componentDidMount() {
    this.props.fetchUserAccounts(this.props.userId);
	}

}


export default connect(
  (state) => ({
    accounts: state.accounts.items,
    isFetching: state.accounts.isFetching,
    userId: state.session.user.id
  }),
  {
    fetchUserAccounts
  }
)(AccountList);