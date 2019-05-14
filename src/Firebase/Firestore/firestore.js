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


}

export default Firestore