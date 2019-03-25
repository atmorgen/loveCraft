export default class Player{

    constructor(name,playerID){
        this.name = name;
        this.playerID = playerID;
    }

    getName(){
        return this.name;
    }

    setName(input){
        this.name = input;
    }

    getPlayerID(){
        return this.playerID;
    }

    setPlayerID(input){
        this.playerID = input;
    }

}