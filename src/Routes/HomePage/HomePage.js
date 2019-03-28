import React, { Component } from 'react';
import './HomePage.css';

import { withAuthorization } from '../Session';

class HomePage extends Component {
    state = {  }
    render() { 
        return (  
            <React.Fragment>
                <div>Main Page</div>
            </React.Fragment>
        );
    }
}
 
const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);