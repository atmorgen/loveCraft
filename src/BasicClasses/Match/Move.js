export default class Move{
    constructor(unit,startingIndex){
        this.move = {
            unit:unit,
            startingIndex:startingIndex,
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

    addNewPosition(index){
        this.move.moves.push({
            index
        })
    }
}