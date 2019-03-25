export default class Unit{

    constructor(ownerID,unitID,unitName,x,y,health){
        this.ownerID = ownerID;
        this.unitID = unitID;
        this.unitName = unitName;
        this.position = {
            x,
            y
        }
        this.stats = {
            health
        }
    }

    getOwnerID(){
        return this.ownerID;
    }

    setOwnerID(input){
        this.ownerID = input;
    }

    getUnitID(){
        return this.unitID;
    }

    setUnitID(input){
        this.unitID = input;
    }

    getUnitName(){
        return this.unitName;
    }

    setUnitName(input){
        this.unitName = input;
    }

    getPosition(){
        return this.position;
    }

    setPosition(x,y){
        this.position.x = x;
        this.position.y = y;
    }

    getStats(){
        return this.stats;
    }

    setStats(input){
        this.stats = input;
    }

}