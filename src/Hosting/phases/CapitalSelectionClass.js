import firebase from 'firebase'
import Firestore from '../../Firebase/Firestore/firestore'
import * as DB from '../../Firebase/Firestore/DB';

//for creating units
import BoardUnits from '../../Board/BoardUnits';

//test capital
import MainTown from '../../BasicClasses/Units/Human/Buildings/MainTown/MainTown';

export default class CapitalSelectionClass{
    constructor(matchID,uid){
        //bindings
        this.createCapital = this.createCapital.bind(this)
        this.db = firebase.firestore()
        this.firestore = new Firestore()
        this.boardUnits = new BoardUnits(matchID,uid)
        this.matchID = matchID
        this.uid = uid
        this.listener = null
        this.state = {
            ctx:document.getElementById('canvasBoardUnit').getContext('2d'),
            canvas:document.getElementById('canvasBoardUnit')
        }
        this.matchesSubscription()
    }

    matchesSubscription(){
        this.listener = this.db.collection(DB.MATCHES)
            .onSnapshot((snapshot)=>{
                    snapshot.docChanges().forEach((change)=>{
                        if(change.type === "modified"){
                            var matchData = change.doc.data()
                            this.checkForSubmissionUpdate(matchData,change.doc.id)
                        }
                    })
                                
        })
    }

    //checks if both players have submitted a capital location.  If they have then kill the listener and create the capitals
    async checkForSubmissionUpdate(matchData,id){
        var turnSubmission = matchData.turnSubmission
        //if both players have submitted a turn
        if(turnSubmission.length > 1){
            this.listener()
            var player1Sub = JSON.parse(turnSubmission[0]).submission
            var player2Sub = JSON.parse(turnSubmission[1]).submission
            await this.createCapital(player1Sub.submission.position,player1Sub.uid)
            await this.createCapital(player2Sub.submission.position,player2Sub.uid)
            
            await this.firestore.clearFirebaseSubmissions(this.matchID)
            await this.setPhaseToUpkeep()
        }
    }

    async createCapital(position,uid){
        await this.boardUnits.unitCreation(new MainTown(uid,80,position.x,position.y,this.state.ctx,this.state.canvas))
    }

    setPhaseToUpkeep(){
        return new Promise((resolve)=>{
            this.db.collection(DB.MATCHES).doc(this.matchID).update({
                phase:"Upkeep"
            }).then(function(){
                console.log('Moving to Upkeep Phase')
                resolve()
            })
        })
    }
}