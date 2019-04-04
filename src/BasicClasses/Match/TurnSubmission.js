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
        this.moves.push(input)
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