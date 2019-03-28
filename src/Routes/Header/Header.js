import React, { Component } from 'react';
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import * as ROUTES from '../routes';
import SignOutButton from '../Account/SignOut/SignOut';
import { AuthUserContext } from '../Session';
import { Firestore } from '../../Firebase/Firestore';
import firebase from 'firebase'

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
                var retreivedUser = await firestore.getUserName(user.uid)
                this.setState({
                    username:retreivedUser
                })
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
       return   <div>{this.state.username}
                    <ul>
                        <li>
                            <Link to={ROUTES.HOME}>Home</Link>
                        </li>
                        <li>
                            <Link to={ROUTES.PROFILE}>Profile</Link>
                        </li>
                        <li>
                            <Link to={ROUTES.SEARCH}>Search</Link>
                        </li>
                        <li>
                            <SignOutButton />
                        </li>
                    </ul>
                </div>
    }
    
    NavigationNonAuth = () => {
        return  <div>
                    <ul>
                        <li>
                            <Link to={ROUTES.SIGN_IN}>Sign In</Link>
                        </li>
                    </ul>
                </div>
    }


    render() { 
        return (  
            <React.Fragment>
                <this.Navigation />
            </React.Fragment>
        );
    }
}
 
export default Navigation;