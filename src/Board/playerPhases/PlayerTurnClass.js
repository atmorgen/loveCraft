//Move Classes
import Move from '../../BasicClasses/Match/Move';

export default class PlayerTurnClass{

    tileSelectTurn(){
        var tileMoves = 0,
            targetIndex,
            tile,
            move;
        // eslint-disable-next-line
        this.state.tileCanvas.canvas.onmousedown = (e)=>{

            var clientRect = this.state.tileCanvas.canvas.getBoundingClientRect(),
            x = e.clientX - clientRect.left,
            y = e.clientY - clientRect.top,
            i;
            for(i = 0;i<this.state.board.tiles.length;i++){
                tile = this.state.board.tiles[i];
                
                if(this.boardFunctions.withinTile(tile,x,y,this.size)) {
                    this.selectionIndex = i;
                    this.BoardUnits.renderUnits(this.size,this.state.board.units)
                    tile.drawSelection(this.size,this.state.unitCanvas.ctx)
                    break;
                }
            }

            //boolean that determines whether or not unit has already been assigned a move
            var alreadyHasMove = this.checkUnitForMove(this.BoardUnits.getUnitAtSelectedTile(tile))
            this.BoardUnits.renderDrawMoving(this.size,this.state.board.tiles)
            
            if(tile.getIsMoveable()){
                if(!move) {
                    move = new Move(this.state.selectedUnit,targetIndex)
                }
                if(tileMoves < move.getUnit().speed){
                    move.addNewPosition(i)
                    tile.drawMoving(this.size,this.state.unitCanvas.ctx)
                    if(tileMoves+1 < move.getUnit().speed){
                        this.boardFunctions.getSurroundingTiles(this.state.board,i,this.size,this.state.unitCanvas.ctx)
                    }
                    this.setState({
                        move:move
                    })
                    tileMoves++
                } 
            }else{
                this.clearMovingItems()
                move = null
                tileMoves = 0
                move = null
                targetIndex = null
                this.setState({
                    selectedTile:this.state.board.tiles[i],
                    move:null
                })
            }
            
            
            if(!move){
                this.setState({
                    selectedUnit:this.BoardUnits.getUnitAtSelectedTile(tile)
                })
                targetIndex = i
            }

            if(!alreadyHasMove){
                if(this.state.selectedUnit){
                    if(this.state.selectedUnit.owner === this.uid){
                        if(tileMoves < this.state.selectedUnit.speed){
                            this.boardFunctions.getSurroundingTiles(this.state.board,i,this.size,this.state.unitCanvas.ctx)                    
                        }
                    }
                }
            }else{

            }
            
        }
    }
}