import HostingFirestore from '../HostingFirestore';
import * as DB from '../../Firebase/Firestore/DB';
import firebase from 'firebase';


/* This class is responsible for resolving turn submissions in the matches */

export default class ResolutionClass{

    constructor(matchID){
        this.submission=null
        this.matchID = matchID
        this.name = "Resolution"
        this.hostingFirestore = new HostingFirestore()
        console.log("Resolution Phase Start")
        this.turnResolution()
    }

    

    async turnResolution(){
        var turnSubmissions = await this.hostingFirestore.getTurnSubmissions(this.matchID)
        console.log(turnSubmissions)
        
        
    }

}