import React, { Component } from 'react';

//Popup Component
import PopupMessages from '../../PopupMessages/PopupMessages';

//for submission
import Submission from '../Submission';
import Firestore from '../../../Firebase/Firestore/firestore'

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

        this.upkeepInit()
    }

    componentDidMount(){
        document.getElementById('popUpMessage').innerHTML = "Upkeep"
    }

    async upkeepInit(){
        await this.boardUnits.unitCreation(new MainTown(this.uid,80,position.x,position.y,this.state.ctx,this.state.canvas))
    }

    async createCapital(position){
        await this.boardUnits.unitCreation(new MainTown(this.uid,80,position.x,position.y,this.state.ctx,this.state.canvas))
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