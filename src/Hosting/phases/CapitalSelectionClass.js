import firebase from 'firebase'
import Firestore from '../../Firebase/Firestore/firestore'
import HostingFirestore from '../HostingFirestore';
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
        this.hostingFirestore = new HostingFirestore()
        this.boardUnits = new BoardUnits(matchID,uid)
        this.matchID = matchID
        this.uid = uid
        this.listener = null
        this.state = {
            ctx:document.getElementById('canvasBoardUnit').getContext('2d'),
            canvas:document.getElementById('canvasBoardUnit')
        }
        this.matchData = null
        this.matchesSubscription()
    }

    matchesSubscription(){
        this.listener = this.db.collection(DB.MATCHES)
            .onSnapshot((snapshot)=>{
                    snapshot.docChanges().forEach((change)=>{
                        if(change.type === "modified"){
                            if(change.doc.data().turnSubmission.length>1){
                                this.matchData = change.doc.data().turnSubmission
                                this.checkForSubmissionUpdate(change.doc.id)
                            }
                        }
                    })
                                
        })
    }

    //checks if both players have submitted a capital location.  If they have then kill the listener and create the capitals
    async checkForSubmissionUpdate(){
        var turnSubmission = this.matchData
        //if both players have submitted a turn
        if(turnSubmission.length > 1){
            await this.firestore.clearFirebaseSubmissions(this.matchID)
            this.listener()
            var player1Sub = JSON.parse(turnSubmission[0]).submission
            var player2Sub = JSON.parse(turnSubmission[1]).submission
            await this.createCapital(player1Sub.submission.position,player1Sub.uid)
            await this.createCapital(player2Sub.submission.position,player2Sub.uid)
            
            await this.setPhaseToUpkeep()
        }
    }

    async createCapital(position,uid){
        await this.boardUnits.unitCreation(new MainTown(uid,80,position.x,position.y,this.state.ctx,this.state.canvas))
    }

    setPhaseToUpkeep(){
        return new Promise((resolve)=>{
            this.db.collection(DB.MATCHES).doc(this.matchID).update({
                phase:"Upkeep",
                subphase:"Resources"
            }).then(function(){
                resolve()
            })
        })
    }
}