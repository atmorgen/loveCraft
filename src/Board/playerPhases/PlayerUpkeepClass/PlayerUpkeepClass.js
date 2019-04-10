import React, { Component } from 'react';

//Popup Component
import PopupMessages from '../../PopupMessages/PopupMessages';

//for submission

//unit tests
import EldritchGrunt from '../../../BasicClasses/Units/Eldritch/Warrior/Basic/EldritchGrunt'
import DruidGatherer from '../../../BasicClasses/Units/Druid/Gatherer/DruidGatherer';
import SwineKnight from '../../../BasicClasses/Units/Druid/Soldier/SwineKnight';
import Cultist from '../../../BasicClasses/Units/Eldritch/Scout/Cultist';

export default class PlayerUpkeepClass extends Component{
    constructor(props){
        super(props)
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

        this.upkeepInit()
        this.tileSelectTurn()
    }

    componentDidMount(){
        document.getElementById('popUpMessage').innerHTML = "Upkeep"
    }

    //highlights the selected tile for capital location decisions
    tileSelectTurn(){
        // eslint-disable-next-line
        this.listener = this.tileCanvas.onmousedown = (e) =>{
            var clientRect = this.tileCanvas.getBoundingClientRect(),
            x = e.clientX - clientRect.left,
            y = e.clientY - clientRect.top,
            i;
            for(i = 0;i<this.board.tiles.length;i++){
                var tile = this.board.tiles[i];
                
                if(this.boardFunctions.withinTile(tile,x,y,this.size)) {
                    this.selectionIndex = i;
                    this.state.ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
                    tile.drawSelection(this.size,this.state.ctx)
                    break;
                }
            }
            this.setState({
                selectedTile:this.board.tiles[i]
            })

        }
    }

    async upkeepInit(){
        await this.boardUnits.unitCreation(new EldritchGrunt(this.uid,80,4,6,this.state.ctx,this.state.canvas))
        await this.boardUnits.unitCreation(new DruidGatherer(this.uid,80,5,6,this.state.ctx,this.state.canvas))
        await this.boardUnits.unitCreation(new SwineKnight(this.uid,80,6,6,this.state.ctx,this.state.canvas))
        await this.boardUnits.unitCreation(new Cultist(this.uid,80,7,6,this.state.ctx,this.state.canvas))
    }

    render() {
        return (
            <React.Fragment>
                <PopupMessages />
                <button onClick={this.submitTurn} id='submitButton'>Submit</button>
            </React.Fragment>
        )
    }
}