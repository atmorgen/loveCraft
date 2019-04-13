import React, { Component } from 'react';
import './PlayerTurnClass.css'

//Popup Component
import PopupMessages from '../../PopupMessages/PopupMessages';

//Move Classes
import Move from '../../../BasicClasses/Match/Move';
import TurnSubmission from '../../../BasicClasses/Match/TurnSubmission';
//Tile Data UI Class
import TileData from '../../TileData/TileData';

/* Class is responsible for listening/processing and submitting turns back to the database for resolution phase */

export default class PlayerTurnClass extends Component{
    constructor(props){
        super(props)
        //bindings
        this.tileSelectTurn = this.tileSelectTurn.bind(this)
        this.checkUnitForMove = this.checkUnitForMove.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
        this.removalHandler = this.removalHandler.bind(this)
        this.submitTurn = this.submitTurn.bind(this)
        //props
        this.tileCanvas = this.props.tileCanvas
        this.unitCtx = this.props.unitCtx
        this.board = this.props.board
        this.size = this.props.size
        this.matchID = this.props.matchID
        this.uid = this.props.uid
        this.boardFunctions = this.props.boardFunctions
        this.boardUnits = this.props.boardUnits
        this.state = {
            ctx:document.getElementById('canvasBoardSelect').getContext('2d'),
            canvas:document.getElementById('canvasBoardSelect')
        }
        //listener
        this.listener = null
        //for submitting a turn
        this.turnSubmission = new TurnSubmission()
        this.tileSelectTurn()
        this.mouseEvent = this.mouseEvent.bind(this)

        
        //reclassifies tiles
        //this.boardReclassified = this.boardFunctions.reClassifyBoard(this.props.board)
    }

    //Init for the tileCanvas mouse event
    tileSelectTurn(){
        // eslint-disable-next-line
        this.tileCanvas.addEventListener('mousedown', this.listener = (e) =>{
            this.mouseEvent(e)
        })
        
    }

    tileMoves = 0
    targetIndex
    tile
    move

    mouseEvent(e){
        var clientRect = this.state.canvas.getBoundingClientRect(),
            x = e.clientX - clientRect.left,
            y = e.clientY - clientRect.top,
            i;
            for(i = 0;i<this.board.tiles.length;i++){
                this.tile = this.board.tiles[i];
                //finds the tile that has been clicked on 
                if(this.boardFunctions.withinTile(this.tile,x,y,this.size)) {
                    //selected tile index
                    this.selectionIndex = i;
                    //clear the canvas before drawing new selections
                    this.state.ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
                    //draw new selection
                    this.tile.drawSelection(this.size,this.state.ctx)
                    break;
                }
            }
            
            //boolean that determines whether or not unit has already been assigned a move.  If it has a move then reassign the tiles to me movedTo tiles
            var alreadyHasMove = this.checkUnitForMove(this.boardUnits.getUnitAtSelectedTile(this.tile))
            //redraw the move
            this.boardUnits.renderDrawMoving(this.size,this.board.tiles)
            /* The below portion is responsible for showing and hiding the correct tile of selection image and for init'ing moves */
            if(this.tile.getIsMoveable()){
                if(!this.move) {
                    this.move = new Move(this.state.selectedUnit,this.state.selectedUnit.position.x,this.state.selectedUnit.position.y)
                }
                if(this.tileMoves < this.move.getUnit().speed){
                    this.move.addNewPosition(this.tile.getPosition().x,this.tile.getPosition().y)
                    this.tile.drawMoving(this.size,this.state.ctx)
                    if(this.tileMoves+1 < this.move.getUnit().speed){
                        //this.boardFunctions.getSurroundingTiles(this.board,i,this.size,this.state.ctx)
                        this.boardFunctions.getSurroundingTiles(this.board,this.tile.position.x,this.tile.position.y,this.size,this.state.ctx)
                    }
                    this.setState({
                        move:this.move
                    })
                    this.tileMoves++
                } 
            }else{
                this.clearMovingItems()
                this.move = null
                this.tileMoves = 0
                this.targetIndex = null
                this.setState({
                    selectedTile:this.board.tiles[i],
                    move:null
                })
            }
            
            if(!this.move){
                this.setState({
                    selectedUnit:this.boardUnits.getUnitAtSelectedTile(this.tile)
                })
                this.targetIndex = i
            }

            if(alreadyHasMove === false){
                if(this.state.selectedUnit){
                    if(this.state.selectedUnit.owner === this.uid){
                        if(this.tileMoves < this.state.selectedUnit.speed){
                            this.boardFunctions.getSurroundingTiles(this.board,this.state.selectedUnit.position.x,this.state.selectedUnit.position.y,this.size,this.state.ctx) 
                       }
                    }
                }
            }       
    }

    //Resets isMoveable and movingTo of all board tiles
    clearMovingItems(){
        for(var i = 0;i<this.board.tiles.length;i++){
            this.board.tiles[i].setIsMoveableToFalse()
            this.board.tiles[i].setMovingToToFalse()
        }
    }

    //redraws movement square if unit has already been given a move
    checkUnitForMove(target){
        if(target){
            var output = false;
            for(var i = 0;i<this.turnSubmission.moves.length;i++){
                var move = this.turnSubmission.moves[i].move
                if(move.unit.unitUID === target.unitUID){
                    for(var j = 0;j<move.moves.length;j++){
                        //var index = this.boardFunctions.getIndexFromPosition(move.moves[j].x,move.moves[j].y)
                        //this.board.tiles[index].drawMoving(this.size,this.state.ctx)
                        this.board.tiles.filter(tile =>
                            tile.getPosition().x === move.moves[j].x && tile.getPosition().y === move.moves[j].y
                        )[0].drawMoving(this.size,this.state.ctx)
                        
                    }
                    output = true                    
                }
            }
            return output
        }
    }

    //handler that is called from TileData.js when the "Submit" button is clicked.  Adds the submitted move for this unit to the turnSubmission object
    submitHandler(value){
        this.turnSubmission.addMove(value[0])
        document.getElementById('tileDataBox').style.display = 'none';
    }

    //handler that is called from TileData.js when the "Remove" button is clicked.  Removes the submitted move for this unit from the turnSubmission object
    removalHandler(value){
        this.turnSubmission.removeMove(value[2].unitUID)
        this.state.ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
        document.getElementById('tileDataBox').style.display = 'none';
    }

    //submits the turn to firebase and then clears the turn so it will be ready for new turn phase
    submitTurn(){
        this.turnSubmission.submitTurn(this.matchID,this.uid)
        this.turnSubmission.clearMoves()
    }
    
    componentDidMount(){
        document.getElementById('popUpMessage').innerHTML = "Turn Phase"
    }

    componentWillUnmount(){
        this.tileCanvas.removeEventListener('mousedown',this.listener)
    }

    render() {
        return (
            <React.Fragment>
                <PopupMessages />
                <button onClick={this.submitTurn} id='submitButton'>Submit</button>
                <TileData tile={this.state.selectedTile} unit={this.state.selectedUnit} move={[this.state.move,this.turnSubmission,this.state.selectedUnit]} size={this.size} onSubmit={this.submitHandler} onRemove={this.removalHandler} />
            </React.Fragment>
        )
    }
}