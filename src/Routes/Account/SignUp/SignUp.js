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
        <h1>SignUp</h1>
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
            <form onSubmit={this.onSubmit}>
                <input
                    name="username"
                    value={username}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Username"
                />
                <input
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                />
                <input
                    name="passwordOne"
                    value={passwordOne}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Password"
                />
                <input
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Confirm Password"
                />
                <button disabled={isInvalid} type="submit">Sign Up</button>

                {error && <p>{error.message}</p>}
            </form>
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