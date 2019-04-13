import {FertileSoil, 
WaterTile,
MountainTile,
ForestTile} from '../BasicClasses/Board/Tiles';
import BoardClass from '../BasicClasses/Board/BoardClass';

export default class BoardFunctions{

    constructor(){
        this.tileTypes = [
            FertileSoil,
            WaterTile,
            MountainTile,
            ForestTile
        ]
    }

    withinTile(tile,x,y,size){
        var relativeX = tile.position.x*size
        var relativeY = tile.position.y*size
        if(x >= relativeX && y >= relativeY){
            if(x <= (relativeX+size) && y <= (relativeY+size)){
                return true;
            }
        }
    }

    getIndexFromPosition(x,y){
        return (x + y*20)
    }

    //reclassifies the Board and all the tiles within it to the correct type of class object
    reClassifyBoard(brd){
        var board = Object.assign(new BoardClass(),brd)
        var tiles = JSON.parse(board.tiles)
        board.clearTiles()
        for(var i = 0;i<tiles.length;i++){
            var tile = tiles[i]
            for(var j = 0;j<this.tileTypes.length;j++){
                if(tile.classType === new this.tileTypes[j]().classType){
                    if(tile.classType === "Water"){
                        var newTile = new this.tileTypes[j](tile.position.x,tile.position.y,tile.surrounding)
                        board.addTile(newTile)
                    }else{
                        var newTile = new this.tileTypes[j](tile.position.x,tile.position.y)
                        board.addTile(newTile)
                    }
                    
                    break;
                }
            }
        }
        return board
    }
}