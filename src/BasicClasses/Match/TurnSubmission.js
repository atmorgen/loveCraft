import Firestore from '../../Firebase/Firestore/firestore';

export default class TurnSubmission{

    constructor(){
        this.moves=[]
        this.firestore = new Firestore()
    }

    getMoves(){
        return this.moves;
    }

    clearMoves(){
        this.moves=[]
    }

    addMove(input){
        if(this.getMoves().length<2){
            this.moves.push(input)
        }
    }

    removeMove(unitUID){
        for(var i = 0;i<this.getMoves().length;i++){
            var move = this.getMoves()[i].move
            if(move.unit.unitUID === unitUID){ 
                this.moves.splice(i,1)
            }
        }
    }

    async submitTurn(matchID,uid){

        var submission = {
            uid:uid,
            moves:this.getMoves()
        }
        if(!(await this.firestore.checkIfAlreadySubmitted(matchID,uid))){
            await this.firestore.submitTurnToMatch(matchID,JSON.stringify(submission))
        }else{
            console.log('you\'ve already submitted a turn!')
        }
        this.clearMoves()
    }

}