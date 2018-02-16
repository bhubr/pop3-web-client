import {
} from '../actions';

const initialState = {
  items: [],
  registerError: '',
  loginError: ''
};

export default (state = initialState, action) => {
  console.log('Users reducer', state, action);
  switch (action.type) {

  default:
    return state;
  }
};
