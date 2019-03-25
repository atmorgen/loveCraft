import UnitAbstract from './UnitAbstract';

export default class Gatherer extends UnitAbstract{

    constructor(ownerID,unitID,unitName,x,y,health,isGathering){
        super(ownerID,unitID,unitName,x,y,health);  
        this.isGathering = isGathering;  
    }

    getIsGather(){
        return this.isGathering;
    }

    setIsGathering(input){
        this.setIsGathering = input;
    }

}