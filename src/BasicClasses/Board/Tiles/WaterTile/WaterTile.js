import TileAbstract from '../TileAbstract'
import waterTile from './Water_Tile.png'

export default class WaterTile extends TileAbstract{
    
    constructor(x,y,surrounding){
        super(x,y)
        this.color = "blue";
        this.classType = 'Water';
        this.imgSize = 256;
        this.surrounding = surrounding
        this.img = waterTile;
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

    setSurrounding(surrounding){
        this.surrounding = surrounding;
    }

    getSurrounding(){
        return this.surrounding;
    }

    getCorrectWaterImage(){
        var left = this.getSurrounding()[0],
            right =this.getSurrounding()[1],
            above = this.getSurrounding()[2],
            below =this.getSurrounding()[3]

        
    }
}