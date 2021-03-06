import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';

import * as ROUTES from '../Routes/routes';
import Header from '../Routes/Header/Header';
import SignUpPage from '../Routes/Account/SignUp/SignUp';
import SignInPage from '../Routes/Account/Login/Login';
import PasswordForgetPage from '../Routes/Account/PasswordForget/PasswordForget';
import HomePage from '../Routes/HomePage/HomePage';
import Profile from '../Routes/Profile/Profile';
import Search from '../Routes/Search/Search';

const FirebaseContext = React.createContext(null);

export const withFirebase = Component => props => (
  <FirebaseContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
);

class App extends React.Component {

  constructor(props){
    super(props)
  }

  state = {
    authUser: null,
  }

  render() {

    return (
      <Router>
        <Header authUser={this.state.authUser}/>

        <hr />
        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
        <Route path={ROUTES.HOME} component={HomePage} />
        <Route path={ROUTES.PROFILE} component={Profile} />
        <Route path={ROUTES.SEARCH} component={Search} />
      </Router>
    );
  }
}

export default withFirebase(App)