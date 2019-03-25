export default class TileAbstract{
    constructor(x,y){
        this.position = {
            x,
            y
        }
    }

    getPosition(){
        return this.position;
    }

    setPosition(x,y){
        this.position.x = x;
        this.position.y = y;
    }
}