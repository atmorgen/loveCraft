import React from 'react';
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import * as ROUTES from '../routes';
import SignOutButton from '../Account/SignOut/SignOut';
import { AuthUserContext } from '../Session';

const Navigation = () => (
    <div>
        <AuthUserContext.Consumer>
            {authUser =>
                authUser ? <NavigationAuth /> : <NavigationNonAuth />
            }
        </AuthUserContext.Consumer>        
    </div>
);

const NavigationAuth = () => {
   return   <div>
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

const NavigationNonAuth = () => {
    return  <div>
                <ul>
                    <li>
                        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
                    </li>
                </ul>
            </div>
}
 
export default Navigation;