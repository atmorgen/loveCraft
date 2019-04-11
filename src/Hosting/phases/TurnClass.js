import HostingFirestore from '../HostingFirestore';
import * as DB from '../../Firebase/Firestore/DB';
import firebase from 'firebase';

/* This class is responsible for waiting for the turn submissions from both players and then pushing the match to the resolution phase */

export default class TurnClass{
    constructor(matchID,uid){
        this.name = "Turn"
        this.matchID = matchID
        this.uid = uid
        this.hostingFirestore = new HostingFirestore()
        this.db = firebase.firestore()
        this.listener = null
        console.log('Turn Phase Starting')

        this.turnSubscription()
    }

    turnSubscription(){
        this.listener = this.db.collection(DB.MATCHES).doc(this.matchID)
                            .onSnapshot((doc)=>{
                                if(doc.data().turnSubmission.length > 1){
                                    this.listener()
                                    this.pushToResolution()
                                }
                            })
        }

    pushToResolution(){
        this.hostingFirestore.setNextMatchPhase(this.matchID,"Resolution")
    } 
}