export default class TurnSubmission{

    constructor(uid){
        this.uid=uid
        moves=[]
    }

    getMoves(){
        return this.moves;
    }

    addMove(input){
        this.moves.push(input)
    }

    submitTurn(){
        
    }

}