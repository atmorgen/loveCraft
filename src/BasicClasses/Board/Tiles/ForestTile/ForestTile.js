import TileAbstract from '../TileAbstract'
import forestImage from './Tree_TIle_Test.png'

export default class ForestTile extends TileAbstract{
    
    constructor(x,y){
        super(x,y)
        this.color = "darkgreen";
        this.classType = 'Forest';
        this.resourceCount = 5;
        this.img = forestImage;
        this.imgSize = 256;
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