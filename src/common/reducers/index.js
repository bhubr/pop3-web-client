import session from './session';
import accounts from './accounts';
import messages from './messages';
import { combineReducers } from 'redux';

const reducers = combineReducers({ session, accounts, messages });
export default reducers;
