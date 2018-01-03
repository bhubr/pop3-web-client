import React from 'react';
import Navbar from './Navbar';
import Register from './Register';
import Login from './Login';
import Profile from './Profile';
import PrivateRoute from './PrivateRoute';
import RedirectWithStatus from './RedirectWithStatus';
import Home from './Home';
import Dashboard from './Dashboard';
import Profiles from './Profiles';

// import simpleAuth from './simpleAuth';
import {
  Route,
  Redirect,
  Link,
  Switch
} from 'react-router-dom';

const Status = ({ code, children }) => (
  <Route render={({ staticContext }) => {
    if (staticContext) {
      staticContext.status = code;
    }
    return children;
  }}/>
);

const NotFound = () => (
  <Status code={404}>
    <div>
      <h1>Sorry, can’t find that.</h1>
    </div>
  </Status>
);

const MyApp = () => (
  <div>
    <Navbar user={null}/>
    {/*<Navbar user={{email:'joe@foo.bar'}}/>*/}

    <Switch>
      <PrivateRoute path="/profile" component={Profile}/>
      <Route exact path="/" component={Home}/>
      <Route path="/register" component={Register}/>
      <Route path="/login" component={Login}/>
      <Route path="/profiles" component={Profiles}/>
      <Route path="/dashboard" component={Dashboard}/>
      {/* some other routes */}
      <RedirectWithStatus
        status={301}
        from="/brands"
        to="/profiles"
      />
      <RedirectWithStatus
        status={302}
        from="/courses"
        to="/dashboard"
      />
      <Route component={NotFound}/>
    </Switch>
  </div>
);

export default MyApp;
