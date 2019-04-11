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
//Unit Functions
import BoardUnits from './BoardUnits';
import TurnSubmission from '../BasicClasses/Match/TurnSubmission';
//Hosting class
import Hosting from '../Hosting/Hosting'
import HostingFirestore from '../Hosting/HostingFirestore'
//PlayerInfoUI
import PlayerInfo from './PlayerInfo/PlayerInfo';

//Player Phase classes
import {
    PlayerCapitalSelectClass,
    PlayerUpkeepClass,
    PlayerTurnClass,
    PlayerResolutionClass
} from './playerPhases';

class Canvas extends Component {
    constructor(props) {
        super(props);
        //width and height of the board
        this.state = { 
            width: 0, 
            height: 0,
            turn:<div></div>
        }
        //tile size
        this.size = 80;
        //Bindings
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.leaveMatch = this.leaveMatch.bind(this);
        this.getBoard = this.getBoard.bind(this)
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
        //for hosting
        this.hosting = null
        this.hostFirestore = new HostingFirestore()
        //for init correct phase class
        this.phases = {
            "Capital":PlayerCapitalSelectClass,
            "Upkeep":PlayerUpkeepClass,
            "Turn":PlayerTurnClass,
            "Resolution":PlayerResolutionClass
        }
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

        //Both players make an attempt to claim hosting rights.  First to request gets rights and begins the hosting services
        if(await this.firestore.requestToBeHost(this.matchID,this.uid)) this.hosting = new Hosting(this.matchID,this.uid)
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
            this.BoardUnits = new BoardUnits(this.matchID,this.uid,this.size)
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
            //Sets subscription events for rest of the match
            this.gameSubscription()
        //else redirect the user to the correct matchID url
        }else{
            window.location.href=`..${ROUTES.GAMEPAGE}/${this.matchID}`
        }  
    }

    componentWillUnmount(){
        //this.leaveMatch()
    }

    //deletes the instance of the match
    async leaveMatch(){
        await this.firestore.removeUsersFromMatch(this.matchID,this.uid)
        await this.firestore.removeMatchFromUserProfile(this.uid)
        window.location.href=`../..${ROUTES.SEARCH}`
    }

    //subscripts to the game responsible for rendering the board/units and running the correct methods for the correct phase
    gameSubscription(){
        this.db.collection(DB.MATCHES).doc(this.id)
            .onSnapshot(async (doc)=>{
                //Responsible for updating this.state.board everytime there is an update to the DB.MATCHES board
                this.matchUpdates(doc.data())

                this.initCorrectPhase(await this.hostFirestore.checkForMatchPhase(this.matchID))
                
            })
    }

    matchUpdates(data){
        //Responsible for updating this.state.board everytime there is an update to the DB.MATCHES board
        if(data !== undefined){
            //reclassing the tiles
            var reclassedBoard = this.boardFunctions.reClassifyBoard(data.board)
            reclassedBoard = this.BoardUnits.reClassifyUnits(reclassedBoard)
            //reclassing the units
            //if the tiles have changed in any way
            if(!_.isEqual(reclassedBoard.tiles,this.state.board.tiles)){
                //rerunning board creation
                this.boardCreation();
            }
            //if the units have changed in any way
            if(!_.isEqual(reclassedBoard.units,this.state.board.units)){
                //re-rendering units
                this.BoardUnits.renderUnits(reclassedBoard.units)
            }
            this.setState({board: reclassedBoard})
        }else{
            this.leaveMatch()
        }
    }

    //Responsible for redrawing the rectangles each time there is an update
    boardCreation(){
        this.state.tileCanvas.ctx.clearRect(0, 0, this.state.tileCanvas.canvas.width, this.state.tileCanvas.canvas.height);
        for(var i = 0;i<this.state.board.tiles.length;i++){
            var tile = this.state.board.tiles[i]
            tile.drawImg(this.size,this.state.tileCanvas.ctx)
        }
    }

    //Determines which phase game is in and init the correct class
    initCorrectPhase(phase){
        if(phase === "Capital"){
            this.setState({
                turn:<PlayerCapitalSelectClass getBoard={this.getBoard} uid={this.uid} matchID={this.matchID} tileCanvas={this.state.tileCanvas.canvas} unitCtx={this.state.unitCanvas.ctx} boardFunctions={this.boardFunctions} boardUnits={this.BoardUnits} board={this.state.board} size={this.size}/>
            })
        }else if(phase === "Upkeep"){
            this.setState({
                turn:<PlayerUpkeepClass getBoard={this.getBoard} uid={this.uid} matchID={this.matchID} tileCanvas={this.state.tileCanvas.canvas} unitCtx={this.state.unitCanvas.ctx} boardFunctions={this.boardFunctions} boardUnits={this.BoardUnits} board={this.state.board} size={this.size}/>
            })
        }else if(phase === "Turn"){
            this.setState({
                turn:<PlayerTurnClass getBoard={this.getBoard} uid={this.uid} matchID={this.matchID} tileCanvas={this.state.tileCanvas.canvas} unitCtx={this.state.unitCanvas.ctx} boardFunctions={this.boardFunctions} boardUnits={this.BoardUnits} board={this.state.board} size={this.size}/>
            })
        }else{
            this.setState({
                turn:<PlayerResolutionClass getBoard={this.getBoard} uid={this.uid} matchID={this.matchID} tileCanvas={this.state.tileCanvas.canvas} unitCtx={this.state.unitCanvas.ctx} boardFunctions={this.boardFunctions} boardUnits={this.BoardUnits} board={this.state.board} size={this.size}/>
            })
        }
    }

    //Used by phase class to make sure it has the most up to date board
    getBoard(){
        return this.state.board
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
                <canvas id='canvasBoardSelect' ref='selectCanvas' width={this.state.width} height={this.state.height}></canvas>
                <PlayerInfo />
                <div>{this.state.turn}</div>
            </React.Fragment>
        )
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Canvas);