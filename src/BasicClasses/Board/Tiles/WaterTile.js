import TileAbstract from './TileAbstract'

export default class WaterTile extends TileAbstract{
    
    constructor(x,y){
        super(x,y)
        this.color = "blue";
        this.classType = 'Water';
    }

}