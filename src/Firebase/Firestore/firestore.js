import firebase from 'firebase';
import * as DB from './DB';

class Firestore{

    constructor(){
        this.db = firebase.firestore();
    }

    setNewUSER(docName,data){
        this.db.collection(DB.USERS).doc(docName).set({
            username:JSON.stringify(data)
        })
        .then(function(docRef) {
            console.log("New User Created!");
        })
        .catch(function(error) {
            console.error("Error adding user: ", error);
        });
    }

    getUserName(uid){
        return new Promise((resolve)=>{
            this.db.collection(DB.USERS).doc(uid).get().then(function(doc){
                resolve(doc.data().username.replace(/"/g,""))
            }).catch(function(error){
                console.log("Error Getting UserName")
            })
        })
    }

    readDoc(docName){
        this.db.collection(DB.BOARDS).doc(docName).get().then(function(doc){
            var output = doc.exists ? 
                doc.data() :
                "No such doc!";
            console.log(JSON.parse(output[DB.BOARD]))
            return JSON.parse(output[DB.BOARD])
        }).then(function(){
            console.log(docName + " pulled and converted to JSON Object")
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }

    ///////Match Data///////////////

    getMatchIDFromProfile(uid){
        return new Promise((resolve)=>{
            this.db.collection(DB.USERS).doc(uid).get().then(function(doc){
                if(doc.exists){
                    resolve(doc.data())
                }
            })
        })
    }

    removeUserFromMatchmakingQueue(docID){
        console.log(docID)
        return new Promise((resolve) =>{
            this.db.collection(DB.MATCHMAKING).doc(docID).delete().then(function(){
                console.log("Removed from Queue")
                resolve()
            }).catch(function(error) {
                console.error("Error removing player: ", error);
            });
        })
    }
    
    addUserToMatchmakingQueue(username,uid){
        return new Promise((resolve)=>{
            this.db.collection(DB.MATCHMAKING).add({
                player:username,
                id:uid,
                ping:null
            }).then(function(doc){
                console.log("Added to Queue with an ID of: ",doc.id)
                resolve(doc.id)
            }).catch((error)=>{
                console.log("There was an error adding to Matchmaking",error)
            })
        })
    }

    removeUsersFromMatch(matchID,uid){
        return new Promise((resolve)=>{
            this.db.collection(DB.MATCHES).doc(matchID).delete().then(function(){
                console.log('Match Deleted')
                resolve()
            }).catch(function(error) {
                console.error("Error removing Match: ", error);
                resolve()
            });
        })
    }

    removeMatchFromUserProfile(uid){
        return new Promise((resolve)=>{
            this.db.collection(DB.USERS).doc(uid).update({
                match:firebase.firestore.FieldValue.delete()
            }).then(function(){
                console.log('Match removed from Users Profile')
                resolve()
            })
        })
    }

    getBoardInformation(matchID){
        return new Promise((resolve)=>{
            this.db.collection(DB.MATCHES).doc(matchID).get().then(function(doc){
                var output = doc.exists ? 
                    doc.data() :
                    "No such doc!";
                resolve(output)
            })
        })
    }

    getUnitsFromMatch(matchID){
        return new Promise((resolve)=>{
            this.db.collection(DB.MATCHES).doc(matchID).get().then(function(doc){
                resolve(doc.data().board.units)
            })
        })
    }

    addUnitsToMatch(matchID,units){
        return new Promise((resolve)=>{
            this.db.collection(DB.MATCHES).doc(matchID).update({
                "board.units":units
            }).then(function(){
                resolve()
            })
        })
    }

    ////These two methods are used to attempt to claim hosting rights

    getMatchHost(matchID,uid){
        return new Promise(resolve =>{
            this.db.collection(DB.MATCHES).doc(matchID).get().then(function(doc){
                if(!doc.data().host || doc.data().host === uid){
                    resolve(true)
                }
                resolve(false)
            }).catch(function(error){
                console.log(error)
                resolve()
            })
        })
    }

    requestToBeHost(matchID,uid){
        return new Promise(async (resolve)=>{
            if(await this.getMatchHost(matchID,uid)){
                
                this.db.collection(DB.MATCHES).doc(matchID).update({
                    host:uid
                }).then(function(){
                    console.log("Claiming Host!")
                    resolve(true)
                })
            }else{
                console.log('host already claimed!')
                resolve(false)
            }
        })
    }

    /////For Turn Submission//////

    submitTurnToMatch(matchID,uid,submission){
        return new Promise(async (resolve)=>{
            if(!(await this.checkIfAlreadySubmitted(matchID,uid))){
                this.db.collection(DB.MATCHES).doc(matchID).update({
                    "turnSubmission":firebase.firestore.FieldValue.arrayUnion(JSON.stringify(submission))
                }).then(function(){
                    resolve()
                })
            }else{
                console.log('You\'ve already submitted a turn')
                resolve()
            }            
        })
    }

    checkIfAlreadySubmitted(matchID,uid){
        return new Promise((resolve)=>{
            this.db.collection(DB.MATCHES).doc(matchID).get().then(function(doc){
                var submissions = doc.data().turnSubmission
                for(var i = 0;i<submissions.length;i++){
                    var submission = JSON.parse(submissions[i]).submission
                    if(uid === submission.uid) resolve(true)
                }
                resolve(false)
            })
        })
    }

    clearFirebaseSubmissions(matchID){
        return new Promise((resolve)=>{
            this.db.collection(DB.MATCHES).doc(matchID).update({
                turnSubmission:[]
            }).then(function(){
                resolve()
            })
        })
    }

}

export default Firestore