import firebase from 'firebase';
import * as DB from '../Firebase/Firestore/DB';

export default class HostingFirestore{

    constructor(){
        this.db = firebase.firestore();
    }

    checkForMatchPhase(matchID){
        return new Promise((resolve)=>{
            this.db.collection(DB.MATCHES).doc(matchID).get().then(function(doc){
                resolve(doc.data().phase)
            })
        })
    }

    setNextMatchPhase(matchID,newPhase){
        return new Promise((resolve)=>{
            this.db.collection(DB.MATCHES).doc(matchID).update({
                phase:newPhase
            }).then(function(){
                resolve()
            })
        })
    }

}