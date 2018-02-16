import {
  FETCH_MESSAGES,
  FETCH_MESSAGES_SUCCESS,
  FETCH_MESSAGES_ERROR,

  FETCH_SINGLE_MESSAGE,
  FETCH_SINGLE_MESSAGE_SUCCESS,
  FETCH_SINGLE_MESSAGE_ERROR,

  RECV_MESSAGE_SUCCESS
} from '../actions';

const initialState = {
  isFetching: false,
  fetchingError: '',
  perAccount: {}
};

export default (state = initialState, action) => {
  console.log('Accounts reducer', state, action);

  const { perAccount } = state;
  const { accountId } = action;


  switch (action.type) {

    // Fetch messages started
    case FETCH_MESSAGES:
      return Object.assign({ ...state }, {
        isFetching: true
      })

    // Fetch messages succeeded
    case FETCH_MESSAGES_SUCCESS:
      const { messages } = action;

      // NOW ONLY SINGLE RECEIVES matter
      return state;
      // return Object.assign({ ...state }, {
      //   isFetching: false,
      //   fetchingError: '',
      //   perAccount: Object.assign({ ...perAccount }, { [accountId]: messages })
      // });

    // Single message received
    case FETCH_SINGLE_MESSAGE_SUCCESS:
    case RECV_MESSAGE_SUCCESS:
      console.log('RECV_MESSAGE_SUCCESS reducer', action);
      const { message } = action;
      let acntMessages = perAccount[accountId];
      if(! acntMessages) {
        acntMessages = [];
      }
      const updatedAcntMessages = [...acntMessages];
      const foundMessage = updatedAcntMessages.find(m => (m.uidl === message.uidl));
      if(foundMessage) {
        const msgIndex = updatedAcntMessages.indexOf(foundMessage);
        updatedAcntMessages[msgIndex] = message;
      }
      else {
        updatedAcntMessages.push(message);
      }
      return Object.assign({ ...state }, {
        perAccount: Object.assign({ ...perAccount }, { [accountId]: updatedAcntMessages })
      });

    default:
      return state;
  }
};
