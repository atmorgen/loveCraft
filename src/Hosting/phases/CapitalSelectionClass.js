import firebase from 'firebase'
import * as DB from '../../Firebase/Firestore/DB';

export default class CapitalSelectionClass{
    constructor(){
        console.log("Captial Selection Start")
        this.db = firebase.firestore()
        this.listener = null
        this.matchesSubscription()
    }

    matchesSubscription(){
        return new Promise((resolve)=>{
            this.listener = this.db.collection(DB.MATCHES)
                                .onSnapshot((snapshot)=>{
                                        snapshot.docChanges().forEach((change)=>{
                                            if(change.type === "modified"){
                                                var matchData = change.doc.data()
                                                resolve(this.checkForSubmissionUpdate(matchData,change.doc.id))
                                            }
                                        })
                                })
        })
    }

    checkForSubmissionUpdate(matchData,id){
        var turnSubmission = matchData.turnSubmission
        
        console.log(turnSubmission)
        /*
        //if both players have submitted a turn
        if(turnSubmission.p1 && turnSubmission.p2){
            var player1Sub = JSON.parse(turnSubmission[0])
            var player2Sub = JSON.parse(turnSubmission[1])
            
            console.log('Found a turn submission for match:',id,'between',player1Sub.uid,'and',player2Sub.uid)

            this.listener()
        }
        */
    }
}