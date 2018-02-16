import React from 'react';
import {
  Link
} from 'react-router-dom';

class EmailItem extends React.Component {

  render() {
    const { acntId } = this.props;
    const { uidl, subject, senderName, senderEmail, body } = this.props.message;
    // const content = html ? html : textAsHtml;
    return (
      <div className="email-item email-item-selected pure-g">
        {/*<div className="pure-u">
          <img width="64" height="64" alt="Tilo Mitra&#x27;s avatar" className="email-avatar" src="/img/common/tilo-avatar.png" />
        </div>*/}

        <div className="pure-u-3-4">
          <h5 className="email-name"><a href={"mailto:" + senderEmail}>{ senderName }</a></h5>
          <h4 className="email-subject"><Link to={ `/inbox/${acntId}/${uidl}` }>{ subject }</Link></h4>
        </div>
      </div>
    );
  }
}

export default class MailList extends React.Component {

  render() {
    const { messages, acntId } = this.props;
    return (
      <div id="list" className="pure-u-1">

        {messages.map((m, i) => <EmailItem key={i} message={m} acntId={acntId} />)}

      {/*
        <div className="email-item email-item-selected pure-g">
          <div className="pure-u">
            <img width="64" height="64" alt="Tilo Mitra&#x27;s avatar" className="email-avatar" src="/img/common/tilo-avatar.png" />
          </div>

          <div className="pure-u-3-4">
            <h5 className="email-name">Tilo Mitra</h5>
            <h4 className="email-subject">Hello from Toronto</h4>
            <p className="email-desc">
              Hey, I just wanted to check in with you from Toronto. I got here earlier today.
            </p>
          </div>
        </div>

        <div className="email-item email-item-unread pure-g">
          <div className="pure-u">
            <img width="64" height="64" alt="Eric Ferraiuolo&#x27;s avatar" className="email-avatar" src="/img/common/ericf-avatar.png" />
          </div>

          <div className="pure-u-3-4">
            <h5 className="email-name">Eric Ferraiuolo</h5>
            <h4 className="email-subject">Re: Pull Requests</h4>
            <p className="email-desc">
              Hey, I had some feedback for pull request #51. We should center the menu so it looks better on mobile.
            </p>
          </div>
        </div>

        <div className="email-item pure-g">
          <div className="pure-u">
            <img width="64" height="64" alt="Yahoo! News&#x27; avatar" className="email-avatar" src="/img/common/ynews-avatar.png" />
          </div>

          <div className="pure-u-3-4">
            <h5 className="email-name">Yahoo! News</h5>
            <h4 className="email-subject">Summary for April 3rd, 2012</h4>
            <p className="email-desc">
              We found 10 news articles that you may like.
            </p>
          </div>
        </div>
      */}
      </div>
    );
  }
}