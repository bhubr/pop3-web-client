import session from './session';
import accounts from './accounts';
import messages from './messages';
import title from './title';
import { combineReducers } from 'redux';

const reducers = combineReducers({ session, accounts, messages, title });
export default reducers;
