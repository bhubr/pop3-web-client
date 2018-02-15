import {
  FETCH_ACCOUNTS,
  FETCH_ACCOUNTS_SUCCESS,
  FETCH_ACCOUNTS_ERROR
} from '../actions';

const initialState = {
	isFetching: false,
	isCreating: false,
  fetchingError: '',
	creationError: '',
	items: []
};

export default (state = initialState, action) => {
  console.log('Accounts reducer', state, action);
  switch (action.type) {
    case FETCH_ACCOUNTS:
      return Object.assign({ ...state }, {
        isFetching: true
      })
    case FETCH_ACCOUNTS_SUCCESS:
      return Object.assign({ ...state }, {
        isFetching: false,
        fetchingError: '',
        items: action.accounts
      });
    default:
      return state;
  }
};
