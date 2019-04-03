import TileAbstract from '../TileAbstract'
import forestImage from './ForestTile.jpg'

export default class ForestTile extends TileAbstract{
    
    constructor(x,y){
        super(x,y)
        this.color = "darkgreen";
        this.classType = 'Forest';
        this.img = forestImage;
        this.imgSize = 1300;
    }

    getColor(){
        return this.color;
    }

    setColor(input){
        this.color = input;
    }

    getImage(){
        return this.img;
    }

    getImageSize(){
        return this.imgSize;
    }
}