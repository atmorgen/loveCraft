import React, { Component } from 'react';
import './PlayerCapitalSelectClass.css'

//Popup Component
import PopupMessages from '../../PopupMessages/PopupMessages';

export default class PlayerCapitalSelectClass extends Component{
    constructor(props){
        super(props)
        this.tileSelectTurn = this.tileSelectTurn.bind(this)
        this.tileCanvas = this.props.tileCanvas
        this.unitCtx = this.props.unitCtx
        this.board = this.props.board
        this.size = this.props.size

        this.state = {

        }
        this.boardFunctions = this.props.boardFunctions
        this.boardUnits = this.props.boardUnits
        console.log("Player Capital Selection Start")
        this.tileSelectTurn()
    }
    
    tileSelectTurn(){
        var tile
        // eslint-disable-next-line
        
        this.tileCanvas.onmousedown = (e)=>{
            var clientRect = this.tileCanvas.getBoundingClientRect(),
            x = e.clientX - clientRect.left,
            y = e.clientY - clientRect.top,
            i;
            for(i = 0;i<this.board.tiles.length;i++){
                tile = this.board.tiles[i];
                
                if(this.boardFunctions.withinTile(tile,x,y,this.size)) {
                    this.selectionIndex = i;
                    this.boardUnits.renderUnits(this.size,this.board.units)
                    tile.drawSelection(this.size,this.unitCtx)
                    break;
                }
            }
            this.setState({
                selectedTile:this.board.tiles[i],
                move:null
            })

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
                        this.board.tiles[move.moves[j].index].drawMoving(this.size,this.unitCtx)
                    }
                    output = true                    
                }
            }
            return output
        }
    }

    submitHandler(value){
        this.turnSubmission.addMove(value[0])
        this.BoardUnits.renderUnits(this.size,this.state.board.units)
        document.getElementById('tileDataBox').style.display = 'none';
    }

    removalHandler(value){
        this.turnSubmission.removeMove(value[2].unitUID)
        document.getElementById('tileDataBox').style.display = 'none';
    }

    submitTurn(){
        console.log('submit')
        //this.turnSubmission.submitTurn(this.matchID,this.uid)
        //this.turnSubmission.clearMoves()
    }
    
    render() {
        return (
            <React.Fragment>
                <PopupMessages />
                <button onClick={this.submitTurn} id='submitButton'>Submit</button>
            </React.Fragment>
        )
    }
    //<TileData tile={this.state.selectedTile} unit={this.state.selectedUnit} move={[this.state.move,this.turnSubmission,this.state.selectedUnit]} size={this.size} onSubmit={this.submitHandler} onRemove={this.removalHandler} />
}