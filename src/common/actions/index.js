// import config from '../config';
// import {
//   insertUser,
//   authenticateUser
// } from '../api';
import api from '../api';
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
    return api.call('authenticateUser', user)
      .then(user => dispatch(loginUserSuccess(user)))
      .catch(err => dispatch(loginUserError(err)));
  };
}

export function registerUser(user)  {
  return dispatch => {
    console.log('registerUser', user);
    dispatch(requestRegisterUser(user));
    return insertUser(user)
      .then(user => dispatch(registerUserSuccess(user)))
      .catch(err => dispatch(registerUserError(err)));
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
