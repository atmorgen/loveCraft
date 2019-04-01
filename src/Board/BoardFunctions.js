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
        if(x >= tile.x && y >= tile.y){
            if(x <= (tile.x+size) && y <= (tile.y+size)){
                return true;
            }
        }
    }

    //Creates and draws the rectangles within the canvas
    rect(props,size) {
        const {ctx, x, y, color, stroke, border} = props;
        //creation
        ctx.rect(x,y,size,size);
        //coloring
        ctx.beginPath()
        ctx.fillStyle=color;
        ctx.fillRect(x,y,size,size);
        //border
        ctx.lineWidth=border;
        ctx.strokeStyle=stroke;
        ctx.strokeRect(x,y,size,size); 
    }

    //reclassifies the Board and all the tiles within it to the correct type of class object
    reClassifyBoard(brd){
        var board = Object.assign(new BoardClass(),brd)
        var tiles = JSON.parse(board.tiles)
        board.clearTiles()
        for(var i = 0;i<tiles.length;i++){
            var tile = tiles[i]
            for(var j = 0;j<this.tileTypes.length;j++){
                if(tile.classType == new this.tileTypes[j]().classType){
                    board.addTile(new this.tileTypes[j](tile.position.x,tile.position.y))
                    break;
                }
            }
        }
        /*
        var units = JSON.parse(board.units)
        board.clearUnits()
        for(var i = 0;i<units.length;i++){
            var unit = units[i]

        }
        */
        return board
    }
}