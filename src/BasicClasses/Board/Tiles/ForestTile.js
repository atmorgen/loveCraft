import TileAbstract from './TileAbstract'

export default class ForestTile extends TileAbstract{
    
    constructor(x,y){
        super(x,y)
        this.color = "darkgreen";
    }

    getColor(){
        return this.color;
    }

    setColor(input){
        this.color = input;
    }

}