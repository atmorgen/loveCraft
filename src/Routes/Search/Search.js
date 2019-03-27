import React, { Component } from 'react';
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import * as ROUTES from '../routes';
import Board from '../../Board/Board';
import './Search.css';

import { Firestore } from '../../Firebase/Firestore';
import { withAuthorization } from '../Session';

/* This is the Class responsible for adding a user to the matchmaking queue and removing them from it if necessary */

class Search extends Component {

    constructor(props){
        super(props)
        this.beginSearch = this.beginSearch.bind(this);
        this.cancelSearch = this.cancelSearch.bind(this)
        this.SearchScreen = this.SearchScreen.bind(this)
        this.state = {
            gameID: "",
            isQueue: false
        }
        this.queueID = ''
        this.firestore = new Firestore()
    }

    searchingformatchscreen(){
        return  <div>
                    <div>Loading...</div> 
                    <button onClick={this.cancelSearch}>Cancel</button>
                </div>
    }

    staticSearchScreen(){
        return <div>
                    <div>Search Page</div>
                    <button onClick={this.beginSearch}>Find Match</button>
                </div>
    }

    //The method that determines what is shown on the search screen based on whether or not the user is searching for a match
    SearchScreen(){
        return this.state.isQueue ? this.searchingformatchscreen() : this.staticSearchScreen()
    }

    render() {
        return (  
            <React.Fragment>
                <this.SearchScreen />
                <hr />

                
            </React.Fragment>
        );
    }

    async beginSearch(){
        console.log('beginning search...')
        var user = this.props.firebase.auth.currentUser
        if(user){
            var uid = user.uid
            var username = await this.firestore.getUserName(uid)
            this.setState({
                isQueue:true
            })
            this.queueID = await this.firestore.addUserToMatchmakingQueue(username,uid)
        }
    }

    async cancelSearch(){
        await this.firestore.removeUserFromMatchmakingQueue(this.queueID)
        this.setState({
            isQueue:false
        })
    }

    gotToGamePage(gameID) {
        window.location.href=this.props.match.path + '/' + gameID;
    }
}
 
const condition = authUser => !!authUser;

export default withAuthorization(condition)(Search);