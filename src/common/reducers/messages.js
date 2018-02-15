import {
  FETCH_MESSAGES,
  FETCH_MESSAGES_SUCCESS,
  FETCH_MESSAGES_ERROR
} from '../actions';

const initialState = {
  isFetching: false,
  fetchingError: '',
  perAccount: {}
};

export default (state = initialState, action) => {
  console.log('Accounts reducer', state, action);
  switch (action.type) {
    case FETCH_MESSAGES:
      return Object.assign({ ...state }, {
        isFetching: true
      })
    case FETCH_MESSAGES_SUCCESS:
      const { perAccount } = state;
      const { accountId, messages } = action;
      return Object.assign({ ...state }, {
        isFetching: false,
        fetchingError: '',
        perAccount: Object.assign({ ...perAccount }, { [accountId]: messages })
      });
    default:
      return state;
  }
};
