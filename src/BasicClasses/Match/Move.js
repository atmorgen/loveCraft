export default class Move{
    constructor(unit,x,y){
        this.move = {
            unit:unit,
            startingPosition:{
                x:x,
                y:y
            },
            moves:[]
        }
    }
    getUnit(){
        return this.move.unit;
    }

    getStartingIndex(){
        return this.startingIndex;
    }

    getMove(){
        return this.move;
    }

    getMoves(){
        return this.move.moves;
    }

    addNewPosition(x,y){
        this.move.moves.push({
            x:x,
            y:y
        })
    }
}