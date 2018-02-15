import session from './session';
// import users from './users';
import { combineReducers } from 'redux';

const reducers = combineReducers({ session }); //, accounts, messages });
export default reducers;
