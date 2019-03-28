export default class BoardFunctions{

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
}