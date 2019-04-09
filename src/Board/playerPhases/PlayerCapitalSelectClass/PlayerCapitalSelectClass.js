import React, { Component } from 'react';
import './PlayerCapitalSelectClass.css'

//Popup Component
import PopupMessages from '../../PopupMessages/PopupMessages';

//for submission
import Submission from '../Submission';
import Firestore from '../../../Firebase/Firestore/firestore'

export default class PlayerCapitalSelectClass extends Component{
    constructor(props){
        super(props)
        //bindings
        this.tileSelectTurn = this.tileSelectTurn.bind(this)
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

        //firestore
        this.firestore = new Firestore()

        this.state = {

        }
        this.tileSelectTurn()
    }

    //anytime the component updates it gets the most reason board from the board class to make sure they match
    componentDidUpdate(){
        this.board = this.props.getBoard()
    }
    
    //highlights the selected tile for capital location decisions
    tileSelectTurn(){
        // eslint-disable-next-line
        this.tileCanvas.onmousedown = (e)=>{
            var clientRect = this.tileCanvas.getBoundingClientRect(),
            x = e.clientX - clientRect.left,
            y = e.clientY - clientRect.top,
            i;
            for(i = 0;i<this.board.tiles.length;i++){
                var tile = this.board.tiles[i];
                
                if(this.boardFunctions.withinTile(tile,x,y,this.size)) {
                    this.selectionIndex = i;
                    this.boardUnits.renderUnits(this.board.units)
                    tile.drawSelection(this.size,this.unitCtx)
                    break;
                }
            }
            this.setState({
                selectedTile:this.board.tiles[i]
            })

        }
    }

    submitTurn(){
        var submission = new Submission(this.state.selectedTile,this.uid)
        this.firestore.submitTurnToMatch(this.matchID,this.uid,submission)
        document.getElementById('popUpMessageBorder').style.display = 'none'
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