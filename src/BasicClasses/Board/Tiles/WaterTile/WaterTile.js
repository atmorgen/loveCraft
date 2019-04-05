import TileAbstract from '../TileAbstract'
import waterTile from './WaterTile.png'

export default class WaterTile extends TileAbstract{
    
    constructor(x,y){
        super(x,y)
        this.color = "blue";
        this.classType = 'Water';
        this.img = waterTile;
        this.imgSize = 240;
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