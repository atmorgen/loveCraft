import TileAbstract from '../TileAbstract'

//noSides Image
import waterTile from './WaterImages/Water_Tile.png'

//Singles Images
import waterBottom from './WaterImages/Singles/onebottom.png'
import waterTop from './WaterImages/Singles/onetop.png'
import waterLeft from './WaterImages/Singles/oneleft.png'
import waterRight from './WaterImages/Singles/oneright.png'

//doubles Images
import waterLeftRight from './WaterImages/Doubles/twoleftright.png'
import waterTopBottom from './WaterImages/Doubles/twotopbottom.png'
import waterLeftTop from './WaterImages/Doubles/twolefttop.png'
import waterLeftBottom from './WaterImages/Doubles/twoleftbottom.png'
import waterRightBottom from './WaterImages/Doubles/tworightbottom.png'
import waterRightTop from './WaterImages/Doubles/tworighttop.png'

//triples Images
import waterBottomOpen from './WaterImages/Triples/threelefttopright.png'
import waterLeftOpen from './WaterImages/Triples/threetoprightbottom.png'
import waterRightOpen from './WaterImages/Triples/threetopleftbottom.png'
import waterTopOpen from './WaterImages/Triples/threebottomleftright.png'

//allSides Image
import pond from './WaterImages/pond.png'

export default class WaterTile extends TileAbstract{
    
    constructor(x,y,surrounding){
        super(x,y)
        this.color = "blue";
        this.classType = 'Water';
        this.imgSize = 256;
        this.surrounding = surrounding
        this.img = this.getCorrectWaterImage(); 
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
        if(this.getSurrounding()){
            var nonWaterSides = this.getSurrounding().filter(tile => tile).length
            switch(nonWaterSides){
                case 1:
                    return this.singleNonWaterSide()
                case 2:
                    return this.doubleNonWaterSide()
                case 3:
                    return this.tripleNonWaterSide()
                case 4:
                    return this.quadNonWaterSide()
                default:
                    return this.allWaterSides()
            }
        }else{
            return this.allWaterSides()
        }
        

    }

    allWaterSides(){
        return waterTile
    }

    singleNonWaterSide(){
        if(this.getSurrounding()[0]) return waterLeft
        else if(this.getSurrounding()[1]) return waterRight
        else if(this.getSurrounding()[2]) return waterTop
        else return waterBottom
    }

    doubleNonWaterSide(){
        if(this.getSurrounding()[0] && this.getSurrounding()[1]) return waterLeftRight
        else if(this.getSurrounding()[2] && this.getSurrounding()[3]) return waterTopBottom
        else if(this.getSurrounding()[0] && this.getSurrounding()[2]) return waterLeftTop
        else if(this.getSurrounding()[0] && this.getSurrounding()[3]) return waterLeftBottom
        else if(this.getSurrounding()[1] && this.getSurrounding()[2]) return waterRightTop
        else if(this.getSurrounding()[1] && this.getSurrounding()[3]) return waterRightBottom
        else return waterTile
    }

    tripleNonWaterSide(){
        
        if(!this.getSurrounding()[0]) return waterLeftOpen
        else if(!this.getSurrounding()[1]) return waterRightOpen
        else if(!this.getSurrounding()[2]) return waterTopOpen
        else if(!this.getSurrounding()[3]) return waterBottomOpen
        else return waterTile
    }

    quadNonWaterSide(){
        return pond;
    }
}