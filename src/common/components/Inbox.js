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
    const messages = msgPerAccount[this.acntId] ? msgPerAccount[this.acntId] : [];

    return (

      <div>
        <MailList messages={messages} />

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
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <p>
                Aliquam ac feugiat dolor. Proin mattis massa sit amet enim iaculis tincidunt. Mauris tempor mi vitae sem aliquet pharetra. Fusce in dui purus, nec malesuada mauris. Curabitur ornare arcu quis mi blandit laoreet. Vivamus imperdiet fermentum mauris, ac posuere urna tempor at. Duis pellentesque justo ac sapien aliquet egestas. Morbi enim mi, porta eget ullamcorper at, pharetra id lorem.
              </p>
              <p>
                Donec sagittis dolor ut quam pharetra pretium varius in nibh. Suspendisse potenti. Donec imperdiet, velit vel adipiscing bibendum, leo eros tristique augue, eu rutrum lacus sapien vel quam. Nam orci arcu, luctus quis vestibulum ut, ullamcorper ut enim. Morbi semper erat quis orci aliquet condimentum. Nam interdum mauris sed massa dignissim rhoncus.
              </p>
              <p>
                Regards,<br />
                Tilo
              </p>
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