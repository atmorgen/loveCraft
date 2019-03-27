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

    addUserToMatchmakingQueue(username,uid){
        return new Promise((resolve)=>{
            this.db.collection(DB.MATCHMAKING).add({
                player:username,
                id:uid
            }).then(function(doc){
                console.log("Added to Queue with an ID of: ",doc.id)
                resolve(doc.id)
            }).catch((error)=>{
                console.log("There was an error adding to Matchmaking",error)
            })
        })
    }

    removeUserFromMatchmakingQueue(docID){
        return new Promise((resolve) =>{
            this.db.collection(DB.MATCHMAKING).doc(docID).delete().then(function(){
                console.log("Removed from Queue")
                resolve()
            })
        })
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

    getMatchIDFromProfile(uid){
        return new Promise((resolve)=>{
            this.db.collection(DB.USERS).doc(uid).get().then(function(doc){
                if(doc.exists){
                    resolve(doc.data())
                }
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

}

export default Firestore