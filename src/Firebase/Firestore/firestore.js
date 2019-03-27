import firebase from 'firebase';
import * as DB from './DB';

class Firestore{

    constructor(){
        this.db = firebase.firestore();
    }

    /**
     * Creates a new document of data within the targetted collection
     * @param {string} docName The name of the doc to be added
     * @param {Object} data The Object to be stringified and stored
     */
    setNewDoc(docName,data){
        this.db.collection(DB.BOARDS).doc(docName).set({
            [DB.BOARD]:JSON.stringify(data)
        })
        .then(function(docRef) {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
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

    /**
     * creates a subscrition event for the specified doc.  Dont forget 
     * to set your event to await.  i.e. var test = await docSubscription(docName)
     * @param {string} docName The name of the doc to be subscribed to
     */
    async docSubscription(docName){
        return new Promise((resolve) => 
            firebase.firestore().collection(DB.BOARDS).doc(docName)
                .onSnapshot(function(doc){
                    resolve(doc.data())
                })
        )
            
            
    }
}

export default Firestore