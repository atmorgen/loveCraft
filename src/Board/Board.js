import React, { Component } from 'react';
import './Board.css';

//Firebase and routes
import { withAuthorization } from '../Routes/Session';

class Canvas extends Component {
    constructor(props) {
        super(props);
        //width and height of the board
        this.state = { 
            width: 0, 
            height: 0
        }
    }

    
    /**
     * 
     * @param {} input Method used to update the width/height of each canvas so that they will all match
     */
    updateWindowDimensions(input) {
        var size = this.size*input
        this.setState({ width: size, height: size })
    }

    render() {
        return (
            <React.Fragment>
                <canvas className='boardCanvas' id='canvasBoardTile' ref='tileCanvas' width={this.state.width} height={this.state.height}></canvas>
                <canvas className='boardCanvas' id='canvasBoardUnit' ref='unitCanvas' width={this.state.width} height={this.state.height}></canvas>
                <canvas className='boardCanvas' id='canvasBoardSelect' ref='selectCanvas' width={this.state.width} height={this.state.height}></canvas>
                <canvas className='boardCanvas' id='canvasBoardAnimation' ref='animationCanvas' width={this.state.width} height={this.state.height}></canvas>
                <canvas className='boardCanvas' id='canvasBoardFOW' ref='FOWCanvas' width={this.state.width} height={this.state.height}></canvas>
            </React.Fragment>
        )
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Canvas);