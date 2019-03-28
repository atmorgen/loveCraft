import TileAbstract from './TileAbstract';

export default class FertileSoil extends TileAbstract{

    constructor(x,y,fertility){
        super(x,y)
        this.fertility = fertility;
        this.seedType = null;
        this.color = "green";
        this.image = null;
        this.classType = 'FertileSoil';
    }

    getFertility(){
        return this.fertility;
    }

    increaseFertility(){
        this.fertility++;
    }

    decreaseFertility(){
        this.fertility--;
    }

    setFertilityToZero(){
        this.fertility = 0;
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


}