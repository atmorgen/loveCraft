import TileAbstract from '../TileAbstract'
import forestImage from './tempForest.png'

export default class ForestTile extends TileAbstract{
    
    constructor(x,y){
        super(x,y)
        this.color = "darkgreen";
        this.classType = 'Forest';
        this.img = forestImage;
        this.imgSize = 256;
    }

    getClassType(){
        return this.classType
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