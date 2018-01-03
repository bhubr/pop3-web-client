import React from 'react';
import {
  Route,
  Redirect
} from 'react-router-dom';

const RedirectWithStatus = ({ from, to, status }) => (
  <Route render={({ staticContext }) => {
    // there is no `staticContext` on the client, so
    // we need to guard against that here
    console.log('context', staticContext, from, to, status);
    if (staticContext) {
      staticContext.status = status;
    }
    return <Redirect from={from} to={to}/>;
  }}/>
);

export default RedirectWithStatus;
