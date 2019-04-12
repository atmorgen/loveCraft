import TileAbstract from '../TileAbstract'
import treesImage from './trees.png'
import trees2Image from './trees2.png'
import trees3Image from './trees3.png'

export default class ForestTile extends TileAbstract{
    
    constructor(x,y){
        super(x,y)
        this.color = "darkgreen";
        this.classType = 'Forest';
        this.resourceCount = 5;
        this.img = this.getImage();
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
var rando = Math.floor(Math.random() * 3); 

switch (rando){
    case 0: return treesImage;
    case 1: return trees2Image;
    case 2: return trees3Image;
    default : return trees2Image;
}

        return trees2Image;
    }

    getImageSize(){
        return this.imgSize;
    }
}