// import config from '../config';
// import {
//   insertUser,
//   authenticateUser
// } from '../api';
import { User, Account, Message } from '../../dist/models';

console.log('DIST/MODELS', User, Account);
// let history;
// if(typeof window !== 'undefined') {
//   history = require('../')
// }
import history from '../history';
// const { tmdbApiKey } = config;

// export const INCREMENT = 'INCREMENT';
// export const DECREMENT = 'DECREMENT';
export const LOGIN_USER         = 'LOGIN_USER';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_ERROR   = 'LOGIN_USER_ERROR';
export const LOGOUT_USER        = 'LOGOUT_USER';

// export const SET_QUERY = 'SET_QUERY';
// export const SEARCH_MOVIES = 'SEARCH_MOVIES';
// export const RECEIVE_MOVIES = 'RECEIVE_MOVIES';

export const REGISTER_USER = 'REGISTER_USER';
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
export const REGISTER_USER_ERROR = 'REGISTER_USER_ERROR';

export const CREATE_ACCOUNT = 'CREATE_ACCOUNT';
export const CREATE_ACCOUNT_SUCCESS = 'CREATE_ACCOUNT_SUCCESS';
export const CREATE_ACCOUNT_ERROR = 'CREATE_ACCOUNT_ERROR';

export const FETCH_ACCOUNTS = 'FETCH_ACCOUNTS';
export const FETCH_ACCOUNTS_SUCCESS = 'FETCH_ACCOUNTS_SUCCESS';
export const FETCH_ACCOUNTS_ERROR = 'FETCH_ACCOUNTS_ERROR';

export const FETCH_SINGLE_MESSAGE = 'FETCH_SINGLE_MESSAGE';
export const FETCH_SINGLE_MESSAGE_SUCCESS = 'FETCH_SINGLE_MESSAGE_SUCCESS';
export const FETCH_SINGLE_MESSAGE_ERROR = 'FETCH_SINGLE_MESSAGE_ERROR';

export const FETCH_MESSAGES = 'FETCH_MESSAGES';
export const FETCH_MESSAGES_SUCCESS = 'FETCH_MESSAGES_SUCCESS';
export const FETCH_MESSAGES_ERROR = 'FETCH_MESSAGES_ERROR';

export const RECV_MESSAGE_SUCCESS = 'RECV_MESSAGE_SUCCESS';

export const UPDATE_USER = 'UPDATE_USER';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_ERROR = 'UPDATE_USER_ERROR';

export const CHANGE_TITLE = 'CHANGE_TITLE';

import socket from '../socket';


// export function increment() {
//   return { type: INCREMENT };
// }
//
// export function decrement() {
//   return { type: DECREMENT };
// }

//
// export function setMovieQuery(query) {
//   return {
//     type: SET_QUERY,
//     query
//   };
// }
//
// export function searchMovies(query) {
//   return {
//     type: SEARCH_MOVIES,
//     query
//   };
// }
//
// export function receiveMovies(json) {
//   return {
//     type: RECEIVE_MOVIES,
//     movies: json.results
//   };
// }

export function changeTitle(title) {
  return {
    type: CHANGE_TITLE,
    title
  };
}

// ------------- FETCH SINGLE MESSAGE ------------
export function requestFetchSingleMessage(accountId, uidl) {
  return {
    type: FETCH_SINGLE_MESSAGE,
    accountId,
    uidl
  };
}

export function fetchSingleMessageSuccess(accountId, message) {
  console.log('fetchSingleMessageSuccess', message);
  return {
    type: FETCH_SINGLE_MESSAGE_SUCCESS,
    accountId,
    message
  };
}

export function fetchSingleMessageError(error) {
  console.log('fetchSingleMessageError', error);
  return {
    type: FETCH_SINGLE_MESSAGE_ERROR,
    error
  };
}

export function fetchSingleMessage(accountId, uidl)  {
  return dispatch => {
    console.log('fetchSingleMessage', uidl);
    dispatch(requestFetchSingleMessage(accountId, uidl));
    return Message.findByUidl(accountId, uidl)
      .then(message => {
        dispatch(fetchSingleMessageSuccess(accountId, message));
        console.log('DISPATCHED fetchSingleMessageSuccess');
        // history.push('/accounts');
      })
      .catch(err => dispatch(fetchSingleMessageError(err)));
  };
}

// ------------- FETCH MESSAGES ------------
export function requestFetchMessages(accountId) {
  return {
    type: FETCH_MESSAGES,
    accountId
  };
}

export function fetchMessagesSuccess(accountId, messages) {
  console.log('fetchMessagesSuccess', messages);
  return {
    type: FETCH_MESSAGES_SUCCESS,
    accountId,
    messages
  };
}

export function fetchMessagesError(error) {
  console.log('fetchMessagesError', error);
  return {
    type: FETCH_MESSAGES_ERROR,
    error
  };
}

export function messageReceived(accountId, message) {
  return {
    type: RECV_MESSAGE_SUCCESS,
    accountId,
    message
  }
}

export function fetchAccountMessages(accountId, userPass)  {
  return dispatch => {
    console.log('fetchAccountMessages', accountId);
    dispatch(requestFetchMessages(accountId));
    return Message.openInbox(accountId, userPass)
    // return Message.findAll(accountId)
      .then(messages => {
        dispatch(fetchMessagesSuccess(accountId, messages));
        console.log('DISPATCHED fetchMessagesSuccess');
        // history.push('/accounts');
      })
      .catch(err => dispatch(fetchMessagesError(err)));
  };
}

// ------------- FETCH ACCOUNTS ------------
export function requestFetchAccounts(userId) {
  return {
    type: FETCH_ACCOUNTS,
    userId
  };
}

export function fetchAccountsSuccess(userId, accounts) {
  console.log('fetchAccountsSuccess', accounts);
  return {
    type: FETCH_ACCOUNTS_SUCCESS,
    userId,
    accounts
  };
}

export function fetchAccountsError(error) {
  console.log('fetchAccountsError', error);
  return {
    type: FETCH_ACCOUNTS_ERROR,
    error
  };
}

export function fetchUserAccounts(userId)  {
  return dispatch => {
    console.log('fetchUserAccounts', userId);
    dispatch(requestFetchAccounts(userId));
    return Account.findAll(userId)
      .then(accounts => {
        dispatch(fetchAccountsSuccess(userId, accounts));
        console.log('DISPATCHED fetchAccountsSuccess');
        // history.push('/accounts');
      })
      .catch(err => dispatch(fetchAccountsError(err)));
  };
}
// --------------------------------------------

// ------------- CREATE ACCOUNT ------------
export function requestCreateAccount(account) {
  return {
    type: CREATE_ACCOUNT,
    account
  };
}

export function createAccountSuccess(account) {
  console.log('createAccountSuccess', account);
  return {
    type: CREATE_ACCOUNT_SUCCESS,
    account
  };
}

export function createAccountError(error) {
  console.log('createAccountError', error);
  return {
    type: CREATE_ACCOUNT_ERROR,
    error
  };
}

export function createAccount(accountProps)  {
  return dispatch => {
    dispatch(requestCreateAccount(accountProps));
    return Account.create(accountProps)
      .then(account => {
        dispatch(createAccountSuccess(account));
      })
      .catch(err => dispatch(createAccountError(err)));
  };
}

// --------------------------------------------

export function requestRegisterUser(user) {
  return {
    type: REGISTER_USER,
    user
  };
}

export function registerUserSuccess(user) {
  console.log('registerUserSuccess', user);
  return {
    type: REGISTER_USER_SUCCESS,
    user
  };
}

export function registerUserError(error) {
  return {
    type: REGISTER_USER_ERROR,
    error
  };
}

export function requestUpdateUser(user) {
  return {
    type: UPDATE_USER,
    user
  };
}

export function updateUserSuccess(user) {
  console.log('registerUserSuccess', user);
  return {
    type: UPDATE_USER_SUCCESS,
    user
  };
}

export function updateUserError(error) {
  return {
    type: UPDATE_USER_ERROR,
    error
  };
}

export function requestLoginUser(user) {
  return {
    type: LOGIN_USER,
    user
  };
}

export function logoutUser() {
  return {
    type: LOGOUT_USER
  };
}

export function loginUserSuccess(user) {
  console.log('loginUserSuccess', user);
  return {
    type: LOGIN_USER_SUCCESS,
    user
  };
}

export function loginUserError(error) {
  return {
    type: LOGIN_USER_ERROR,
    error
  };
}


export function loginUser(user)  {
  return dispatch => {
    console.log('loginUser', user);
    dispatch(requestLoginUser(user));
    return User.authenticate(user)
      .then(user => {
        dispatch(loginUserSuccess(user));
        socket.emit('auth:success', user);
        console.log('DISPATCHED LOGIN SUCCESS', history);
        history.push(user.redirectTo ? user.redirectTo : '/profile');
      })
      .catch(err => dispatch(loginUserError(err)));
  };
}

function timeoutPromise(timeout) {
  return value => {
    return new Promise((resolve, reject) => {
      console.error('TIMEOUT');
      setTimeout(() => resolve(value), timeout);
    });
  }
}

export function registerUser(userProps)  {
  return dispatch => {
    console.log('registerUser', userProps);
    dispatch(requestRegisterUser(userProps));
    return User.create(userProps)
      .then(timeoutPromise(300))
      .then(userModel => {
        dispatch(registerUserSuccess(userModel))
        loginUser(userProps)(dispatch);
      })
      .catch(err => dispatch(registerUserError(err)));
  };
}

export function updateUser(user)  {
  return dispatch => {
    console.log('updateUser', user);
    dispatch(requestUpdateUser(user));
    return User.update(user)
      .then(user => dispatch(updateUserSuccess(user)))
      .catch(err => dispatch(updateUserError(err)));
  };
}

// export function fetchMovies(query) {
//   // Thunk middleware knows how to handle functions.
//   // It passes the dispatch method as an argument to the function,
//   // thus making it able to dispatch actions itself.
//   return function (dispatch) {
//     console.log('fetchMovies', dispatch);
//     // First dispatch: the app state is updated to inform
//     // that the API call is starting.
//
//     dispatch(searchMovies(query));
//
//     // The function called by the thunk middleware can return a value,
//     // that is passed on as the return value of the dispatch method.
//
//     // In this case, we return a promise to wait for.
//     // This is not required by thunk middleware, but it is convenient for us.
//     const q = encodeURIComponent(query);
//
//     return fetch(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${q}`)
//       .then(
//         response => response.json(),
//         // Do not use catch, because that will also catch
//         // any errors in the dispatch and resulting render,
//         // causing a loop of 'Unexpected batch number' errors.
//         // https://github.com/facebook/react/issues/6895
//         error => console.log('An error occurred.', error)
//       )
//       .then(json =>
//         // We can dispatch many times!
//         // Here, we update the app state with the results of the API call.
//
//         dispatch(receiveMovies(json))
//       );
//   };
// }
