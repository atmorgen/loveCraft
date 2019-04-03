export default class Move{
    constructor(unit,x,y){
        this.move = {
            unit:unit,
            newPosition:{
                x:x,
                y:y
            }
        }
    }

    getMove(){
        return this.move;
    }
}