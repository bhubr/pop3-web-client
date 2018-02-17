import React from 'react';
import {
  Link
} from 'react-router-dom';

class EmailItem extends React.Component {

  render() {
    const { acntId } = this.props;
    const { uidl, subject, senderName, senderEmail, body } = this.props.message;
    return (
      <li className="collection-item">
        <Link to={ `/inbox/${acntId}/${uidl}` }>{ subject }</Link>
      </li>
    );
  }
}

export default class MailList extends React.Component {

  render() {
    const { messages, acntId } = this.props;
    return (
      <div id="list" className="collection">
        {messages.map((m, i) => <EmailItem key={i} message={m} acntId={acntId} />)}
      </div>
    );
  }
}