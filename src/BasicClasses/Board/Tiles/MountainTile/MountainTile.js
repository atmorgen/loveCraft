import TileAbstract from '../TileAbstract'
import forestImage from './mountain.png'

export default class MountainTile extends TileAbstract{
    
    constructor(x,y){
        super(x,y)
        this.color = "gray";
        this.classType = 'Mountain';
        this.img = forestImage;
        this.imgSize = 480;
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