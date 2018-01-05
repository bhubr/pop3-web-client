import session from './session';
import users from './users';
import { combineReducers } from 'redux';

const reducers = combineReducers({ session, users });
export default reducers;
