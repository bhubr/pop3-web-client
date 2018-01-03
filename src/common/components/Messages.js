import React from 'react';

class MessageItem extends React.Component {
  render() {
    return (
      <li>{ this.props.text }</li>
    );
  }
}

class Messages extends React.Component {
  constructor(props) {
    super(props);
    if( typeof window !== 'undefined' ) {
      console.log('FOUND STATE', window.initialState);
    }
    this.state =
      typeof window !== 'undefined' ? window.initialState :
        {
          messages: []
        };
  }

  componentDidMount() {
    console.log('component did mount');
    fetch('/api/messages')
      .then(response => response.json())
      .then(messages => {
        console.log(messages);
        this.setState({ messages });
      });
  }

  render() {
    var messages = this.state.messages.map(m => (
      <MessageItem key={ m.id } text={ m.text } />
    ));
    return (
      <div>
        <h2>Messages</h2>
        <ul>
          { messages }
        </ul>
      </div>
    );
  }
}

export default Messages;
