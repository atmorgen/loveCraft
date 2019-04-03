export default class Unit{

    constructor(){
        this.unitUID = this.getRandomID()
    }

    getRandomID(){
        return '_' + Math.random().toString(36).substr(1, 11);
    }

    getUnitUID(){
        return this.unitUID;
    }

}