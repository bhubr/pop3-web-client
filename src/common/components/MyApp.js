import React from 'react';
import MailList from './MailList';
import Navbar from './Navbar';
import Register from './Register';
import Login from './Login';
import Profile from './Profile';
import PrivateRoute from './PrivateRoute';
import RedirectWithStatus from './RedirectWithStatus';
import Home from './Home';
import Dashboard from './Dashboard';
// import Messages from './Messages';
import routes from './routes';

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
  <div id="layout" className="content pure-g">


    <Navbar user={null}/>
    {/*<Navbar user={{email:'joe@foo.bar'}}/>*/}

    <MailList />

    <Switch>
      <PrivateRoute path="/profile" component={Profile}/>
      {/*<Route path="/profile" component={Profile}/>*/}
      <Route exact path="/" component={Home}/>
      <Route path="/register" component={Register}/>
      <Route path="/login" component={Login}/>
      <Route path="/dashboard" component={Dashboard}/>
      {/*<Route path="/messages" component={Messages}/>*/}
      {routes.map(route => (
        <Route key={route.path} {...route}/>
      ))}

      <Route path="/dashboard" component={Dashboard}/>
      {/* some other routes
      <RedirectWithStatus
        status={301}
        from="/brands"
        to="/messages"
      />
      <RedirectWithStatus
        status={302}
        from="/courses"
        to="/dashboard"
      /> */}
      <Route component={NotFound}/>
    </Switch>
  </div>
);

export default MyApp;
