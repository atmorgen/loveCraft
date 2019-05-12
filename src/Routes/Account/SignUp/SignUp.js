import React, { Component } from 'react';
import './SignUp.css';

import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../../../Firebase';
import { Firestore } from '../../../Firebase/Firestore';

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
  };

const SignUpPage = () => (
    <div>
        <SignUpForm />
    </div>
);

class SignUpFormBase extends Component {

    constructor(props){
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    state = {  }

    onSubmit = event => {
        // eslint-disable-next-line
        const { username, email, passwordOne } = this.state;

        this.props.firebase
          .doCreateUserWithEmailAndPassword(email, passwordOne)
          .then(authUser => {
            this.addUserToFirestore(authUser,username)
            this.setState({ ...INITIAL_STATE });
          })
          .catch(error => {
            this.setState({ error });
          });
    
        event.preventDefault();
    }

    //creates a new userAccount within the firestore with the doc id that matches the UID from signing up
    addUserToFirestore(authUser,username){
        var firestore = new Firestore()
        var uid = (authUser.user.uid).replace(/"/g,"")
        firestore.setNewUSER(uid,username)
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() { 

        const {
            username,
            email,
            passwordOne,
            passwordTwo,
            error,
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            username === '';


        return (
            <div className="signUpForm">
            <h1>Sign Up</h1>  
            <form className="innerSignUpForm" onSubmit={this.onSubmit}>
                <ul>
                    <li>
                        <label>Username</label>
                        <input
                            htmlFor="UserName"
                            name="username"
                            value={username}
                            onChange={this.onChange}
                            type="text"
                        />
                    </li>
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
                            name="passwordOne"
                            value={passwordOne}
                            onChange={this.onChange}
                            type="password"
                        />
                    </li>
                    <li>
                        <label>Confirm Password</label>
                        <input
                            name="passwordTwo"
                            value={passwordTwo}
                            onChange={this.onChange}
                            type="password"
                        />
                    </li>
                    <li>
                        <button disabled={isInvalid} className="signUpButton" type="submit">Sign Up</button>
                    </li>

                {error && <p>{error.message}</p>}
                </ul>
            </form>
            </div>
        );
    }
}

const SignUpLink = () => (
    <p>
      Don't have an account? <Link to={'/signUp'}>Sign Up</Link>
    </p>
  );

const SignUpForm = compose(
    withRouter,
    withFirebase,
  )(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };