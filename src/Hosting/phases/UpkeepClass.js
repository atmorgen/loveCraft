import HostingFirestore from '../HostingFirestore'

/* This class is responsible for allocating resources, handling starvation and building new units. */

export default class UpkeepClass{
    constructor(matchID,uid){
        this.name = "Upkeep"
        this.matchID = matchID
        this.uid = uid
        this.hostingFirestore = new HostingFirestore()
        this.getSubPhase()

        //bindings
        this.resourcesSubphase = this.resourcesSubphase.bind(this)
        this.starvationSubphase = this.starvationSubphase.bind(this)
        this.unitsSubphase = this.unitsSubphase.bind(this)
        this.pushToTurnPhase = this.pushToTurnPhase.bind(this)

        this.subPhases = {
            "Resources":this.resourcesSubphase,
            "Starvation":this.starvationSubphase,
            "Units":this.unitsSubphase
        }
    }

    async getSubPhase(){
        var subPhase = await this.hostingFirestore.checkForMatchSubPhase(this.matchID)

        this.subPhases[subPhase]()
    }

    async resourcesSubphase(){
        console.log('resources')
        await this.hostingFirestore.setNextMatchSubPhase(this.matchID,"Starvation")
        this.starvationSubphase()
    }

    async starvationSubphase(){
        console.log('starvation')
        await this.hostingFirestore.setNextMatchSubPhase(this.matchID,"Units")
        this.unitsSubphase()
    }

    async unitsSubphase(){
        console.log("units")
        await this.pushToTurnPhase()
        this.pushToTurnPhase()
    }

    pushToTurnPhase(){
        this.hostingFirestore.setNextMatchPhase(this.matchID,"Turn")
    }
    
}