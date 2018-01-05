import {
  LOGIN_USER,
  LOGIN_USER_ERROR,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER
} from '../actions';

const initialState = {
  user: null,
  loginError: ''
};

export default (state = initialState, action) => {
  // migrate
  if(! state || state.email) {
    state = initialState;
  }
  //
  switch (action.type) {
  case LOGIN_USER_SUCCESS: {
    const { user, loginError } = state;
    // console.log(state, { items: [ ...items, action.user ] });
    return { user: action.user, loginError: '' };
  }
  case LOGIN_USER_ERROR: {
    return {
      user: null,
      loginError: action.error.message
    };
  }
  case LOGOUT_USER: {
    return {
      user: null,
      loginError: ''
    };
  }
  default:
    return state;
  }
};
