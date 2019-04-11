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
        /*
        for(var i = 0;i<3;i++){
            var player1Submission = submissions.submission1.moves[i]
            var player2Submission = submissions.submission2.moves[i]

            if(player1Submission){
                console.log(player1Submission)
            }
            if(player2Submission){
                console.log(player2Submission)
            }
        }
        */
    }

}