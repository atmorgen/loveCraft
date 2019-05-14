import React, { Component } from 'react';
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import * as ROUTES from '../routes';
import SignOutButton from '../Account/SignOut/SignOut';
import { AuthUserContext } from '../Session';
import { Firestore } from '../../Firebase/Firestore';
import firebase from 'firebase'
import "./Header.css"

class Navigation extends Component {
    constructor(props){
        super(props)
        this.state = {
            username:null
        }
        this.getUserName()
    }
    state = {  }

    async getUserName(){
        var firestore = new Firestore()
        firebase.auth().onAuthStateChanged(async (user)=> {
            if (user) {
                var retrievedUser = await firestore.getUserName(user.uid)
                this.setState({
                    username:retrievedUser
                })
                document.title = retrievedUser
                localStorage.setItem('username',retrievedUser)
            }else{
                this.setState({
                    username:null
                })
            }
          });
    }

    Navigation = () => (
        <div>
            <AuthUserContext.Consumer>
                {authUser =>
                    authUser ? <this.NavigationAuth /> : <this.NavigationNonAuth />
                }
            </AuthUserContext.Consumer>        
        </div>
    );
    
    NavigationAuth = () => {
       return (
       <div>
        <nav>
            <div className="currentUser">
                Hi, {this.state.username}
            </div>
            <div>
                <Link to={ROUTES.HOME} className="navLinks">Home</Link>
                <Link to={ROUTES.PROFILE} className="navLinks">Profile</Link>
                <Link to={ROUTES.SEARCH} className="navLinks">Search</Link>
                <SignOutButton />
            </div>
            </nav>
        </div>
       )
    }
    
    NavigationNonAuth = () => {
        return (
        <div>
            <nav className="navNonAuth">
                <Link to={ROUTES.SIGN_IN} className="signIn">Sign In</Link>
            </nav>
        </div>
        ) 
    }


    render() { 
        return (  
            <React.Fragment>
                <this.Navigation/>
            </React.Fragment>
        );
    }
}
 
export default Navigation;