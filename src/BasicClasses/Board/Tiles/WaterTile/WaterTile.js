import TileAbstract from '../TileAbstract'
import waterTile from './Water_Tile.png'

export default class WaterTile extends TileAbstract{
    
    constructor(x,y){
        super(x,y)
        this.color = "blue";
        this.classType = 'Water';
        this.img = waterTile;
        this.imgSize = 256;
    }

    getClassType(){
        return this.classType
    }

    getImage(){
        return this.img;
    }

    getImageSize(){
        return this.imgSize;
    }
}