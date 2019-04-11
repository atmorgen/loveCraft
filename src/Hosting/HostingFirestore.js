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

    checkForMatchSubPhase(matchID){
        return new Promise((resolve)=>{
            this.db.collection(DB.MATCHES).doc(matchID).get().then(function(doc){
                resolve(doc.data().subphase)
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

    setNextMatchSubPhase(matchID,subphase){
        return new Promise((resolve)=>{
            this.db.collection(DB.MATCHES).doc(matchID).update({
                subphase:subphase
            }).then(function(){
                resolve()
            })
        })
    }

    getTurnSubmissions(matchID){
        return new Promise((resolve)=>{
            this.db.collection(DB.MATCHES).doc(matchID).get().then(function(doc){
                resolve(doc.data().turnSubmission)
            })
        })
    }

}