import TileAbstract from '../TileAbstract'
import stoneImage from './mountain.png'

export default class MountainTile extends TileAbstract{
    
    constructor(x,y){
        super(x,y)
        this.color = "gray";
        this.classType = 'Mountain';
        this.resourceCount = 6;
        this.img = stoneImage;
        this.imgSize = 480;
    }

    getresourceCount(){
        return this.resourceCount;
    }

    increaseresourceCount(){
        this.resourceCount++;
    }

    decreaseresourceCount(){
        this.resourceCount--;
    }

    setresourceCountToZero(){
        this.resourceCount = 0;
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