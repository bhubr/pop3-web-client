import session from './session';
import accounts from './accounts';
import { combineReducers } from 'redux';

const reducers = combineReducers({ session, accounts }); //, accounts, messages });
export default reducers;
