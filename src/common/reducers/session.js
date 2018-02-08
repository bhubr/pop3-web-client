import {
  LOGIN_USER,
  LOGIN_USER_ERROR,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER,
  UPDATE_USER,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR
} from '../actions';

const initialState = {
  user: null,
  loginError: '',
  updateError: ''
};

export default (state = initialState, action) => {
  // migrate
  if(! state || state.email) {
    state = initialState;
  }
  //
  switch (action.type) {
  case LOGIN_USER_SUCCESS: {
    const { user, loginError, updateError } = state;
    // console.log(state, { items: [ ...items, action.user ] });
    return { user: action.user, loginError: '', updateError };
  }
  case LOGIN_USER_ERROR: {
    return {
      user: null,
      loginError: action.error.message,
      updateError: ''
    };
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
