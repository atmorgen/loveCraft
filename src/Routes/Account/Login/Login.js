import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { SignUpLink } from '../SignUp/SignUp';
import { PasswordForgetLink } from '../PasswordForget/PasswordForget';
import { withFirebase } from '../../../Firebase';
import * as ROUTES from '../../routes';
import "./Login.css"

const SignInPage = () => (
  <div className="signInMain">
    <h1>Sign In</h1>
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <form onSubmit={this.onSubmit} className="signInForm">
          <ul>
            <li>
              <label>Email</label>
              <input
                name="email"
                value={email}
                onChange={this.onChange}
                type="text"
              />
            </li>
            <li>
              <label>Password</label>
              <input
                name="password"
                value={password}
                onChange={this.onChange}
                type="password"
              />
            </li>
            <li>
              <button disabled={isInvalid} type="submit" className="signInButton">Sign In</button>
            </li>

          {error && <p>{error.message}</p>}
          </ul>
      </form>
    );
  }
}

const SignInForm = withRouter(withFirebase(SignInFormBase));

export default withFirebase(SignInPage);

export { SignInForm };