import React, { Component } from 'react';
import './Board.css';
import _ from 'lodash';

//Firebase and routes
import { withAuthorization } from '../Routes/Session';
import { Firestore } from '../Firebase/Firestore';
import firebase from 'firebase'
import * as DB from '../Firebase/Firestore/DB';
import * as ROUTES from '../Routes/routes';
//Functions
import BoardFunctions from './BoardFunctions'
//Tile UI Component
import TileData from './TileData/TileData';
//Unit Functions
import BoardUnits from './BoardUnits';
//Move Classes
import Move from '../BasicClasses/Match/Move';
import TurnSubmission from '../BasicClasses/Match/TurnSubmission';

class Canvas extends Component {
    constructor(props) {
        super(props);
        //width and height of the board
        this.state = { 
            width: 0, 
            height: 0
        }
        //tile size
        this.size = 80;
        //Bindings
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.tileSelect = this.tileSelect.bind(this);
        this.leaveMatch = this.leaveMatch.bind(this);
        this.submitTurn = this.submitTurn.bind(this)
        //Firestore
        this.firestore = new Firestore()
        this.id = this.props.match.params.gameID;
        this.db = firebase.firestore()
        this.matchID=null
        this.uid=null
        //Units Information
        this.BoardUnits = null
        //For Tile Selection
        this.selectionIndex = null
        //Get list of keys held down
        this.keysDown = []
        //Functions
        this.boardFunctions = null
        //for submitting a turn
        this.turnSubmission = new TurnSubmission()
    }

    componentDidMount(){
        this.gameInit()
    }

    getUID(){
        return new Promise((resolve)=>{
            setTimeout(() => {
                resolve(this.props.firebase.auth.currentUser.uid)
            }, 1000);
        })
    }
    
    //Runs when the player is navigated to the Game route.  Initializes all the necessary objects and pulls the original instance of the board for creation
    async gameInit(){
        //getting the matchID from the users profile db
        this.uid = await this.getUID()
        this.matchID = (await this.firestore.getMatchIDFromProfile(this.uid)).match

        //if the gameID url matches the expected matchID from the users profile then continue
        if(this.matchID===this.id){
            //retrive the matchInfo
            var matchInfo = await this.firestore.getBoardInformation(this.matchID)       
        
            //inits the context and canvas refs
            this.setState(
                {   
                    tileCanvas:{
                        ctx:this.refs.tileCanvas.getContext('2d'),
                        canvas:this.refs.tileCanvas
                    },
                    unitCanvas:{
                        ctx:this.refs.unitCanvas.getContext('2d'),
                        canvas:this.refs.unitCanvas
                    }                   
                })
            this.boardFunctions = new BoardFunctions(this.state.tileCanvas.ctx,this.state.tileCanvas.canvas)
            //creates the units on the board
            this.BoardUnits = new BoardUnits(this.state.unitCanvas.ctx,this.state.unitCanvas.canvas,this.matchID,this.uid)
            //reclassifies tiles
            var boardReclassified = this.boardFunctions.reClassifyBoard(matchInfo.board)
            //reclassifies units
            //boardReclassified = this.BoardUnits.reClassifyUnits(boardReclassified)
            //sets board state
            this.setState({board: boardReclassified})
            //updates the size of the board to match the total size of all the rects in the canvas
            this.updateWindowDimensions(this.state.board.size)
            //creates the boards
            this.boardCreation()
            //inits the tileSelection events
            this.tileSelect();
            //Sets subscription events for rest of the match
            this.gameSubscription()
        //else redirect the user to the correct matchID url
        }else{
            window.location.href=`..${ROUTES.GAMEPAGE}/${this.matchID}`
        }  
    }

    componentWillUnmount(){
        this.leaveMatch()
    }

    //deletes the instance of the match
    async leaveMatch(){
        await this.firestore.removeUsersFromMatch(this.matchID,this.uid)
        await this.firestore.removeMatchFromUserProfile(this.uid)
        window.location.href=`../..${ROUTES.SEARCH}`
    }

    //Responsible for updating this.state.board everytime there is an update to the DB.MATCHES board
    gameSubscription(){
        this.db.collection(DB.MATCHES).doc(this.id)
            .onSnapshot((doc)=>{
                if(doc.data() !== undefined){
                    //reclassing the tiles
                    var reclassedBoard = this.boardFunctions.reClassifyBoard(doc.data().board)
                    //reclassing the units
                    reclassedBoard = this.BoardUnits.reClassifyUnits(reclassedBoard)

                    //if the tiles have changed in any way
                    if(!_.isEqual(reclassedBoard.tiles,this.state.board.tiles)){
                        //rerunning board creation
                        this.boardCreation();
                    }
                    //if the units have changed in any way
                    if(!_.isEqual(reclassedBoard.units,this.state.board.units)){
                        //re-rendering units
                        this.BoardUnits.renderUnits(this.size,reclassedBoard.units)
                    }
                    this.setState({board: reclassedBoard})
                }else{
                    this.leaveMatch()
                }
            })
    }

    //Responsible for redrawing the rectangles each time there is an update
    boardCreation(){
        this.state.tileCanvas.ctx.clearRect(0, 0, this.state.tileCanvas.canvas.width, this.state.tileCanvas.canvas.height);
        for(var i = 0;i<this.state.board.tiles.length;i++){
            var tile = this.state.board.tiles[i]
            tile.drawImg(false,this.size,this.state.tileCanvas.ctx)
        }
    }

    tileSelect(){
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

            for(var j = 0;j<this.state.board.tiles.length;j++){
                var drawingTile = this.state.board.tiles[j];
                if(drawingTile.getMovingTo()){
                    drawingTile.drawMoving(this.size,this.state.unitCanvas.ctx)
                } 
            }
            
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
                    selectedTile:this.state.board.tiles[i]
                })
            }
            
            
            if(!move){
                this.setState({
                    selectedUnit:this.BoardUnits.getUnitAtSelectedTile(tile)
                })
                targetIndex = i
            }

            if(this.state.selectedUnit){
                if(this.state.selectedUnit.owner === this.uid){
                    if(tileMoves < this.state.selectedUnit.speed){
                        this.boardFunctions.getSurroundingTiles(this.state.board,i,this.size,this.state.unitCanvas.ctx)                    
                    }
                }
            }
        }
    }

    submitHandler(value){
        console.log(value)
    }

    makeMove(){
        var tileToMoveTo = this.state.selectedTile
        this.BoardUnits.moveUnit(this.matchID,this.state.selectedUnit,tileToMoveTo.getPosition().x,tileToMoveTo.getPosition().y)
    }

    submitTurn(){
        this.BoardUnits.submitTurn()
    }

    clearMovingItems(){
        for(var i = 0;i<this.state.board.tiles.length;i++){
            this.state.board.tiles[i].setIsMoveableToFalse()
            this.state.board.tiles[i].setMovingToToFalse()
        }
    }

     updateWindowDimensions(input) {
        var size = this.size*input
        this.setState({ width: size, height: size })
    }

    render() {
        return (
            <React.Fragment>
                <div>ID: {this.props.match.params.gameID}</div>
                <button onClick={this.leaveMatch}>Leave Match</button>
                <canvas id='canvasBoardUnit' ref='unitCanvas' width={this.state.width} height={this.state.height}></canvas>
                <canvas id='canvasBoardTile' ref='tileCanvas' width={this.state.width} height={this.state.height}></canvas>
                <button onClick={this.submitTurn} id='submitButton'>Submit</button>
                <TileData tile={this.state.selectedTile} unit={this.state.selectedUnit} move={this.state.move} size={this.size} onSubmit={this.submitHandler} />
            </React.Fragment>
        )
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Canvas);