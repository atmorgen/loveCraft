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
        //for submitting a turn
        this.turnSubmission = new TurnSubmission()
        this.tileSelectTurn()
    }
    tileSelectTurn(){
        var tileMoves = 0,
            targetIndex,
            tile,
            move;
        // eslint-disable-next-line
        this.tileCanvas.onmousedown = (e)=>{
            var clientRect = this.state.canvas.getBoundingClientRect(),
            x = e.clientX - clientRect.left,
            y = e.clientY - clientRect.top,
            i;
            for(i = 0;i<this.board.tiles.length;i++){
                tile = this.board.tiles[i];
                
                if(this.boardFunctions.withinTile(tile,x,y,this.size)) {
                    this.selectionIndex = i;
                    this.state.ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
                    tile.drawSelection(this.size,this.state.ctx)
                    break;
                }
            }
            
            //boolean that determines whether or not unit has already been assigned a move
            var alreadyHasMove = this.checkUnitForMove(this.boardUnits.getUnitAtSelectedTile(tile))
            this.boardUnits.renderDrawMoving(this.size,this.board.tiles)
            
            if(tile.getIsMoveable()){
                if(!move) {
                    move = new Move(this.state.selectedUnit,targetIndex)
                }
                if(tileMoves < move.getUnit().speed){
                    move.addNewPosition(i)
                    tile.drawMoving(this.size,this.state.ctx)
                    if(tileMoves+1 < move.getUnit().speed){
                        this.boardFunctions.getSurroundingTiles(this.board,i,this.size,this.state.ctx)
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
                    selectedTile:this.board.tiles[i],
                    move:null
                })
            }
            
            if(!move){
                this.setState({
                    selectedUnit:this.boardUnits.getUnitAtSelectedTile(tile)
                })
                targetIndex = i
            }

            if(!alreadyHasMove){
                if(this.state.selectedUnit){
                    if(this.state.selectedUnit.owner === this.uid){
                        if(tileMoves < this.state.selectedUnit.speed){
                            this.boardFunctions.getSurroundingTiles(this.board,i,this.size,this.state.ctx)                    
                        }
                    }
                }
            }else{

            }            
        }
    }

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
                        this.board.tiles[move.moves[j].index].drawMoving(this.size,this.state.ctx)
                    }
                    output = true                    
                }
            }
            return output
        }
    }

    submitHandler(value){
        this.turnSubmission.addMove(value[0])
        //this.boardUnits.renderUnits(this.size,this.board.units)
        document.getElementById('tileDataBox').style.display = 'none';
    }

    removalHandler(value){
        this.turnSubmission.removeMove(value[2].unitUID)
        this.state.ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
        document.getElementById('tileDataBox').style.display = 'none';
    }

    submitTurn(){
        this.turnSubmission.submitTurn(this.matchID,this.uid)
        this.turnSubmission.clearMoves()
    }
    
    componentDidMount(){
        document.getElementById('popUpMessage').innerHTML = "Turn Phase"
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