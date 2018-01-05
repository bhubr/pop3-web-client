import {
  REGISTER_USER,
  REGISTER_USER_ERROR,
  REGISTER_USER_SUCCESS,
  LOGIN_USER,
  LOGIN_USER_ERROR,
  LOGIN_USER_SUCCESS
} from '../actions';

const initialState = {
  items: [],
  registerError: '',
  loginError: ''
};

export default (state = initialState, action) => {
  console.log('Users reducer', state, action);
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
  default:
    return state;
  }
};
