import HostingFirestore from './HostingFirestore';
import * as DB from '../Firebase/Firestore/DB';
import firebase from 'firebase';

import {
    CapitalSelectionClass,
    UpkeepClass,
    TurnClass,
    ResolutionClass
} from './phases';

/* This class is responsible for handling the Hosting Responsibilities.  Including data processing and phase determination */

export default class Hosting{
    constructor(matchID,uid){
        this.matchID = matchID
        this.uid = uid
        this.hostingFirestore = new HostingFirestore()
        this.db = firebase.firestore()
        
        //bindings
        this.gameSubscription = this.gameSubscription.bind(this)

        this.phaseNames = [
            "Capital",
            "Upkeep",
            "Turn",
            "Resolution"
        ]

        this.phases = {
            [this.phaseNames[0]]:CapitalSelectionClass,
            [this.phaseNames[1]]:UpkeepClass,
            [this.phaseNames[2]]:TurnClass,
            [this.phaseNames[3]]:ResolutionClass
        }
        this.phase = null

        this.gameSubscription()
    }

    gameSubscription(){
        this.db.collection(DB.MATCHES).doc(this.matchID)
            .onSnapshot(async (doc)=>{
                if(this.phase !== doc.data().phase){
                    this.phase = doc.data().phase
                    new this.phases[doc.data().phase](this.matchID,this.uid)
                }
            })
    }

    //looks up the present phase and then moves to the next one in order
    async moveToNextPhase(){
        //gets present phase
        this.phase = await this.hostingFirestore.checkForMatchPhase(this.matchID)
        //classname of the present phase
        var className = this.phases[this.phase].name
        //holds the next phase
        var nextPhase = className === "UpkeepClass" ? TurnClass : className === "TurnClass" ? ResolutionClass : UpkeepClass
        //nulls previous phase
        this.phase = null
        //inits new phase
        this.phase = new nextPhase()
        //pushes new phase to firebase
        await this.hostingFirestore.setNextMatchPhase(this.matchID,this.phase.name)
    }
}