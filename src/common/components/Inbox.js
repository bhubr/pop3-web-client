import React from 'react';
import api from '../api';
import MailList from './MailList';
import { connect } from 'react-redux';
import {
  fetchAccountMessages,
  fetchSingleMessage,
  messageReceived
} from '../actions';

import socket from '../socket';

let numMessages;
let msgFetched = 0;
let msgErrored = 0;

socket.on('message:list:success', function (idUidls) {
  console.log('LIST MESSAGES SUCCESS', idUidls);
  numMessages = idUidls.length;
});

socket.on('message:fetch:error', function (errMsg) {
  console.log(`FETCH MESSAGE ERROR ${msgErrored}`, errMsg);
});


class Inbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };

    console.log(this.props);
    this.acntId = this.props.match.params.acntId;
  }

  componentDidMount() {
    this.props.fetchAccountMessages(this.acntId, this.props.userPass);

    socket.on('message:fetch:success', message => {
      msgFetched++;
      console.log(`FETCH MESSAGE SUCCESS ${msgFetched}/${numMessages}`, message);
      this.props.messageReceived(this.acntId, message);
    });
  }

  render() {
    const { msgPerAccount } = this.props;
    const { uidl } = this.props.match.params;
    const messages = msgPerAccount[this.acntId] ? msgPerAccount[this.acntId] : [];
    let message;
    let emailContentBody;
    if(uidl && (message = messages.find(m => m.uidl === uidl))) {
    }
    else {
      message = {
        subject: 'N/A',
        senderName: 'N/A',
        senderEmail: 'nobody@example.com',
        body: 'Select a message first!'
      }
    }

    const { subject, senderName, senderEmail, body } = message;
    const senderLink = "mailto:" + senderEmail;

    return (

      <div>
        <MailList messages={messages} acntId={this.acntId} />

        <div id="main" className="pure-u-1">
          <div className="email-content">
            <div className="email-content-header pure-g">
              <div className="pure-u-1">
                <h1 className="email-content-title">{ subject || <span style={{ color: '#b44' }}>(vide)</span> }</h1>
                <p className="email-content-subtitle">
                  From <a href={senderLink}>{ senderName || senderEmail }</a> at <span><del>3:56pm, April 3, 2012</del></span>
                </p>
              </div>

            {/*
              <div className="email-content-controls pure-u-1-2">
                <button className="secondary-button pure-button">Reply</button>
                <button className="secondary-button pure-button">Forward</button>
                <button className="secondary-button pure-button">Move to</button>
              </div>
            */}
            </div>

            <div className="email-content-body">
              <div dangerouslySetInnerHTML={{ __html: message.body }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    const { msgPerAccount } = this.props;
    const { params } = this.props.match;
    const nextParams = nextProps.match.params;
    console.log('Inbox.componentWillReceiveProps', nextProps, this.props, 'current/next uidl', params.uidl, nextParams.uidl, msgPerAccount[this.acntId]);
    if(params.uidl !== nextParams.uidl && msgPerAccount[this.acntId]) {
      const msg = msgPerAccount[this.acntId].find(m => (m.uidl === nextParams.uidl));
      console.log('Message', msg);
      if(! msg.body) {
        this.props.fetchSingleMessage(this.acntId, nextParams.uidl);
      }
    }
  }
}

export default connect(
  (state) => ({
    isFetching: state.messages.isFetching,
    msgPerAccount: state.messages.perAccount,
    // userId: state.session.user.id,
    userPass: state.session.upw
  }),
  {
    fetchAccountMessages,
    fetchSingleMessage,
    messageReceived
  }
)(Inbox);