import TileAbstract from './TileAbstract'

export default class MountainTile extends TileAbstract{
    
    constructor(x,y){
        super(x,y)
        this.color = "gray";
    }

    getColor(){
        return this.color;
    }

    setColor(input){
        this.color = input;
    }

}