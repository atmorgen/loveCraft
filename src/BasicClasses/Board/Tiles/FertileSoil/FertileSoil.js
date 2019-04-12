import TileAbstract from '../TileAbstract';
import grass from './grass.png'

export default class FertileSoil extends TileAbstract{

    constructor(x,y){
        super(x,y)
        this.resourceCount = 10;
        this.seedType = null;
        this.color = "green";
        this.image = null;
        this.classType = 'FertileSoil';
        this.img = grass;
        this.imgSize = 256;
    }

    getClassType(){
        return this.classType
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

    getSeedType(){
        return this.seedType;
    }

    setSeedType(input){
        this.seedType = input;
    }

    getColor(){
        return this.color;
    }

    setColor(input){
        this.color = input;
    }

    getImage(){
        return this.image;
    }

    setImage(input){
        this.image = input;
    }

    getImageSize(){
        return this.imgSize;
    }

}