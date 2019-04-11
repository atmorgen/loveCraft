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

    getSurroundingTiles(board,index,size, ctx){
        var surroundingIndex = [index-1, //left
                                index+1, //right
                                index-board.size,  //above
                                index+board.size]  //below
        
        for(var i = 0;i<surroundingIndex.length;i++){
            var tile = board.tiles[surroundingIndex[i]]
            //tile is on the map
            if(tile){
                if(!tile.getMovingTo()){
                    //if tile isn't water 
                    if(tile.getClassType() !== "Water") {
                        tile.drawMoveable(size,ctx)
                    }
                }
            }
        }

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
                    board.addTile(new this.tileTypes[j](tile.position.x,tile.position.y))
                    break;
                }
            }
        }
        return board
    }
}