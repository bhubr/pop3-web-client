import {

  LOGIN_USER,
  LOGIN_USER_ERROR,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER,

  REGISTER_USER,
  REGISTER_USER_ERROR,
  REGISTER_USER_SUCCESS,

  UPDATE_USER,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR
} from '../actions';

const initialState = {
  user: null,
  isRegistering: false,
  isAuthenticating: false,
  isUpdating: false,
  registrationError: '',
  authenticationError: '',
  updateError: ''
};

export default (state = initialState, action) => {

  console.log('SESSION REDUCER', state);
  // migrate
  if(! state || state.email) {
    state = initialState;
  }
  //
  switch (action.type) {

      case REGISTER_USER_SUCCESS: {
        const { items } = state;
        console.log(state, { items: [ ...items, action.user ] });
        return { items: [ ...items, action.user ], registerError: '' };
      }
      case REGISTER_USER_ERROR: {
        return Object.assign({...state}, {
          registerError: action.error.message
        });
      }


      /*-------------------------*
       | AUTHENTICATION reducers
       *-------------------------*
       |
       */
      case LOGIN_USER_SUCCESS: {
        const { user, loginError, updateError } = state;
        // console.log(state, { items: [ ...items, action.user ] });
        return { user: action.user, loginError: '', updateError };
      }

      // Error
      case LOGIN_USER_ERROR: {
        console.log('LOGIN ERROR', action);
        return Object.assign({ ...state }, {
          authenticationError: action.error.message
        });
      }
      case LOGOUT_USER: {
        return {
          user: null,
          loginError: '',
          updateError: ''
        };
      }
      case UPDATE_USER_SUCCESS: {
        const { user, loginError, updateError } = state;
        return { user: action.user, loginError: '', updateError: '' };
      }
      case UPDATE_USER_ERROR: {
        const { user } = state;
        return {
          user: null,
          loginError: '',
          updateError: action.error.message
        };
  }
  default:
    return state;
  }
};
