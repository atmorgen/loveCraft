import React, { Component } from 'react';
import * as ROUTES from '../routes';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Landing extends Component {

    constructor(props){
        super(props)
    }

    state = {  }
    render() { 
        return (  
            <div>
                <ul>
                    <li>
                        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
                    </li>
                </ul>
            </div>
        );
    }
}
 
export default Landing;