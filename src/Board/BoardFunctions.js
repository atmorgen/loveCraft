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

    //Creates and draws the rectangles within the canvas
    rect(props,size) {
        const {ctx, x, y, color, stroke, border} = props;
        //creation
        ctx.rect(x,y,size,size);
        //coloring
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
                if(tile.classType === new this.tileTypes[j]().classType){
                    board.addTile(new this.tileTypes[j](tile.position.x,tile.position.y))
                    break;
                }
            }
        }
        return board
    }

    //returns whether or not a tile is within moveable range of the selected unit
    isMoveable(i,selectedIndex,selectedUnit,boardSize){
        var moveable = false
        if(selectedUnit){
            if(selectedUnit.username === localStorage.getItem('username')){
                //left and right
                
                if(i>=selectedIndex-selectedUnit.speed && i<=selectedIndex+selectedUnit.speed){
                    moveable=true
                }
                //above
                if(i===selectedIndex-boardSize || i===selectedIndex-(boardSize*2)){
                    moveable=true
                }
                //below
                if(i===selectedIndex+boardSize || i === selectedIndex+(boardSize*2)){
                    moveable=true
                }
            }
        }
        return moveable
    }
}