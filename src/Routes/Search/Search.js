import React, { Component } from 'react';
import * as ROUTES from '../routes';
import * as DB from '../../Firebase/Firestore/DB';
import './Search.css';

import { Firestore } from '../../Firebase/Firestore';
import { withAuthorization } from '../Session';
import firebase from 'firebase';

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
        this.queueListener = null
        this.firestore = new Firestore()
        this.db = firebase.firestore()
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
        console.log('Beginning Search...')
        var user = this.props.firebase.auth.currentUser
        if(user){
            var uid = user.uid
            await this.startListener(uid)
            var username = await this.firestore.getUserName(uid)
            this.queueID = await this.firestore.addUserToMatchmakingQueue(username,uid)
            this.setState({
                isQueue:true
            })
        }
    }

    async cancelSearch(){
        await this.firestore.removeUserFromMatchmakingQueue(this.queueID)
        this.setState({
            isQueue:false
        })
        var user = this.props.firebase.auth.currentUser
        if(user){
            var uid = user.uid
            this.stopListener(uid)
        }
    }

    async startListener(uid){
        console.log('Listening for Match')
        new Promise((resolve)=>{
            this.queueListener = this.db.collection(DB.USERS).doc(uid)
                .onSnapshot(async (doc)=>{
                        var match = doc.data().match
                        if(match){
                            console.log('Match Found!')
                            await this.cancelSearch()
                            resolve(this.gotToGamePage(doc.data().match))
                        }
                        resolve()
                })
        })
    }

    stopListener(uid){
        this.queueListener()
        console.log("Listener Off")
    }

    componentWillUnmount(){
        this.cancelSearch()
    }

    gotToGamePage(gameID) {
        console.log("Navigating to game page: ",gameID)
        window.location.href=`..${ROUTES.GAMEPAGE}/${gameID}`
    }
}
 
const condition = authUser => !!authUser;

export default withAuthorization(condition)(Search);