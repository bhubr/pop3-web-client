import {
  FETCH_ACCOUNTS,
  FETCH_ACCOUNTS_SUCCESS,
  FETCH_ACCOUNTS_ERROR,

  CREATE_ACCOUNT,
  CREATE_ACCOUNT_SUCCESS,
  CREATE_ACCOUNT_ERROR,
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

    /*-------------------------*
     | FETCH ACCOUNTS reducers
     *-------------------------*
     |
     */

    case FETCH_ACCOUNTS:
      return Object.assign({ ...state }, {
        isFetching: true,
        fetchingError: ''
      });

    case FETCH_ACCOUNTS_SUCCESS:
      return Object.assign({ ...state }, {
        isFetching: false,
        items: action.accounts
      });

    case FETCH_ACCOUNTS_ERROR:
      return Object.assign({ ...state }, {
        isFetching: false,
        fetchingError: action.error.message
      });


    /*-------------------------*
     | CREATE ACCOUNT reducers
     *-------------------------*
     |
     */
    case CREATE_ACCOUNT:
      return Object.assign({ ...state }, {
        isCreating: true,
        creationError: ''
      });
    case CREATE_ACCOUNT_SUCCESS:
      const { items } = state;
      return Object.assign({ ...state }, {
        isCreating: false,
        items: [ ...items, action.account ]
      });
    case CREATE_ACCOUNT_ERROR:
      return Object.assign({ ...state }, {
        isCreating: false,
        creationError: action.error.message
      });
 
    default:
      return state;
  }
};
