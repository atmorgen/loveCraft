import React, { Component } from 'react';
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import * as ROUTES from '../routes';
import Board from '../../Board/Board';
import './Search.css';

import { withAuthorization } from '../Session';

class Search extends Component {

    constructor(){
        super()
        this.beginSearch = this.beginSearch.bind(this);
    }

    state = {  }
    render() {
        return (  
            <React.Fragment>
                <div>Search Page</div>
                <button onClick={this.beginSearch}>Search</button>

                <hr />

                <Route path={`${ROUTES.SEARCH}/:gameID`} component={Board} />
            </React.Fragment>
        );
    }

    getRandomID(){
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    beginSearch() {
        var gameID = this.getRandomID();
        window.location.href=this.props.match.path + '/' + gameID;
    }
}
 
const condition = authUser => !!authUser;

export default withAuthorization(condition)(Search);