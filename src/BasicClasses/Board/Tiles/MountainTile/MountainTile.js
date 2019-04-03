import TileAbstract from '../TileAbstract'

export default class MountainTile extends TileAbstract{
    
    constructor(x,y){
        super(x,y)
        this.color = "gray";
        this.classType = 'Mountain';
        this.img = null;
        this.imgSize = null;
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