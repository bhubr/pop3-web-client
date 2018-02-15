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

      case REGISTER_USER: {
        return Object.assign({...state}, {
          isRegistering: true
        });
      }

      case REGISTER_USER_SUCCESS: {
        console.log('REGISTER_USER_SUCCESS', action);
        // const { items } = state;
        // console.log(state, { items: [ ...items, action.user ] });
        // return { items: [ ...items, action.user ], registerError: '' };
        return Object.assign({...state}, {
          registrationError: '',
          isRegistering: false
        });
      }
      case REGISTER_USER_ERROR: {
        console.error('REGISTER_USER_ERROR', action.error);
        return Object.assign({...state}, {
          registrationError : action.error.message,
          isRegistering: false
        });
      }


      /*-------------------------*
       | AUTHENTICATION reducers
       *-------------------------*
       |
       */
      case LOGIN_USER: {
        return Object.assign({...state}, {
          isAuthenticating: true
        });
      }



      case LOGIN_USER_SUCCESS: {
        console.log('LOGIN SUCCESS', action);
        // const { user, loginError, updateError } = state;
        // console.log(state, { items: [ ...items, action.user ] });
        // return { user: action.user, loginError: '', updateError };
        return Object.assign({ ...state }, {
          user: action.user,
          isAuthenticating: false,
          authenticationError: ''
        });
      }

      // Error
      case LOGIN_USER_ERROR: {
        console.log('LOGIN ERROR', action);
        return Object.assign({ ...state }, {
          isAuthenticating: false,
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
