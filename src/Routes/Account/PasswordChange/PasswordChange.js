import React, { Component } from 'react';
import "./PasswordChange.css"

import { withFirebase } from '../../../Firebase';

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { passwordOne } = this.state;

    this.props.firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
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
    const { passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';

    return (
      <form onSubmit={this.onSubmit} className="passwordChangeForm">
        <ul>
          <li>
            <label>New Password</label>
            <input
              name="passwordOne"
              value={passwordOne}
              onChange={this.onChange}
              type="password"
            />
          </li>
          <li>
            <label>Confirm New Password</label>
            <input
              name="passwordTwo"
              value={passwordTwo}
              onChange={this.onChange}
              type="password"
            />
          </li>
          <li>
            <button disabled={isInvalid} type="submit" className="passwordReset">Reset Password</button>
          </li>

          {error && <p>{error.message}</p>}
        </ul>
      </form>
    );
  }
}

export default withFirebase(PasswordChangeForm);

export { PasswordChangeForm }