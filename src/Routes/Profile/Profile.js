import React, { Component } from 'react';
import './Profile.css';

import { PasswordForgetForm } from '../Account/PasswordForget/PasswordForget';
import { PasswordChangeForm } from '../Account/PasswordChange/PasswordChange';

import { withAuthorization } from '../Session';

class Profile extends Component {
    state = {  }
    render() { 
        return (  
            <div className="profilePage">
                <h1>Profile Page</h1>
                <div className="passwordForms">
                    <PasswordForgetForm />
                    <PasswordChangeForm />
                </div>
            </div>

        );
    }
}
 
const condition = authUser => !!authUser;

export default withAuthorization(condition)(Profile);