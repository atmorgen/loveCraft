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
        const {ctx, x, y, stroke, border, image, imageSize} = props;

        var img = new Image();
            img.src = image;

        //creation
        //coloring
        ctx.beginPath()
        //border
        ctx.lineWidth=border;
        ctx.strokeStyle=stroke;
        ctx.strokeRect(x,y,size,size); 
        ctx.drawImage(img,
            0,
            0,
            imageSize,
            imageSize,
            x,
            y,
            size,
            size
        );
        
        

        /* This is the older method and i'm not comfortable getting rid of it yet.
        ctx.rect(x,y,size,size);
        ctx.drawImage(img, 0, 0, 300,300,x*size,y*size,size,size);
        //coloring
        ctx.beginPath()
        ctx.fillStyle=color;
        ctx.fillRect(x,y,size,size);
        //border
        ctx.lineWidth=border;
        ctx.strokeStyle=stroke;
        ctx.strokeRect(x,y,size,size); 
        */
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
        return board
    }
}