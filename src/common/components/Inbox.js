import React from 'react';
import api from '../api';
import MailList from './MailList';
import { connect } from 'react-redux';
import { fetchAccountMessages } from '../actions';

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
  }

  render() {
    const { msgPerAccount } = this.props;
    const { uidl } = this.props.match.params;
    const messages = msgPerAccount[this.acntId] ? msgPerAccount[this.acntId] : [];
    const emailContentBody = uidl ? <div dangerouslySetInnerHTML={{ __html: (messages.find(m => m.uidl === uidl)).body }}></div> : <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit</p>;
    return (

      <div>
        <MailList messages={messages} acntId={this.acntId} />

        <div id="main" className="pure-u-1">
          <div className="email-content">
            <div className="email-content-header pure-g">
              <div className="pure-u-1-2">
                <h1 className="email-content-title">Hello from Toronto</h1>
                <p className="email-content-subtitle">
                  From <a>Tilo Mitra</a> at <span>3:56pm, April 3, 2012</span>
                </p>
              </div>

              <div className="email-content-controls pure-u-1-2">
                <button className="secondary-button pure-button">Reply</button>
                <button className="secondary-button pure-button">Forward</button>
                <button className="secondary-button pure-button">Move to</button>
              </div>
            </div>

            <div className="email-content-body">
              {emailContentBody}

            </div>
          </div>
        </div>
      </div>
    );
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
    fetchAccountMessages
  }
)(Inbox);