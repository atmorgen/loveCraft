import HostingFirestore from './HostingFirestore'

import {
    CapitalSelectionClass,
    UpkeepClass,
    TurnClass,
    ResolutionClass
} from './phases';

/* This class is responsible for handling the Hosting Responsibilities.  Including data processing and phase determination */

export default class Hosting{
    constructor(matchID){
        this.matchID = matchID
        this.hostingFirestore = new HostingFirestore()
        
        //bindings
        this.hostingInit = this.hostingInit.bind(this)

        this.phase = null

        this.phaseNames = [
            "Upkeep",
            "Turn",
            "Resolution"
        ]

        this.phases = {
            [this.phaseNames[0]]:UpkeepClass,
            [this.phaseNames[1]]:TurnClass,
            [this.phaseNames[2]]:ResolutionClass
        }

        this.hostingInit()
    }

    //Determines the present phase and begins the correct class
    async hostingInit(){
        this.phase = await this.hostingFirestore.checkForMatchPhase(this.matchID)
        
        if(!this.phase){
            this.phase = new CapitalSelectionClass()
        }else{
            this.phase = new this.phases[this.phase]
        }
        this.moveToNextPhase()
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