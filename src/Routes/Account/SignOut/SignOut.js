import React from 'react';

import { withFirebase } from '../../../Firebase';
import "./SignOut.css"

const SignOutButton = ({ firebase }) => (
  <button type="button" className="signOutButton" onClick={firebase.doSignOut}>
    Sign Out
  </button>
);

export default withFirebase(SignOutButton);