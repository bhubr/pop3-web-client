import {
} from '../actions';

const initialState = {
	isLoading: false,
	isCreating: false,
	creationError: '',
	items: []
};

export default (state = initialState, action) => {
  console.log('Accounts reducer', state, action);
  switch (action.type) {

  default:
    return state;
  }
};
