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
//Unit Testing
import BoardUnits from './BoardUnits';

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            width: 0, 
            height: 0
        }
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
        //Board Information
        this.rects = []
        //Units Information
        this.BoardUnits = null
        //For Tile Selection
        this.selectionIndex = null
        //Get list of keys held down
        this.keysDown = []
        //Functions
        this.boardFunctions = null
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

    tileSelect(){
        // eslint-disable-next-line
        this.state.tileCanvas.canvas.onmousedown = (e)=>{
            var clientRect = this.state.tileCanvas.canvas.getBoundingClientRect(),
            x = e.clientX - clientRect.left,
            y = e.clientY - clientRect.top
            for(var i = 0;i<this.state.board.tiles.length;i++){
                var rect = this.state.board.tiles[i];
                
                if(this.boardFunctions.withinTile(rect,x,y,this.size)) {
                    this.selectionIndex = i;
                    this.BoardUnits.renderUnits(this.size,this.state.board.units)
                    rect.drawSelection(this.size,this.state.unitCanvas.ctx)
                    break;
                }  
            }
            
            this.setState({
                selectedTile:this.state.board.tiles[i]
            })

            if(this.state.selectedTile){
                if(this.state.selectedTile.isMoveable){
                    if(this.state.selectedTile.getClassType() !== "Water"){
                        this.makeMove()
                    }
                }else{
                    this.clearMoveable()
                }
            }
            
            this.setState({
                selectedUnit:this.BoardUnits.getUnitAtSelectedTile(this.state.board.tiles[i])
            })

            if(this.state.selectedUnit){
                if(this.state.selectedUnit.username === localStorage.getItem('username')){
                    this.isMoveable()
                    this.movingUnit = this.state.selectedUnit
                }
            }
        }
    }

    makeMove(){
        var tileToMoveTo = this.state.selectedTile
        this.BoardUnits.moveUnit(this.matchID,this.state.selectedUnit,tileToMoveTo.getPosition().x,tileToMoveTo.getPosition().y)
    }

    submitTurn(){
        this.BoardUnits.submitTurn()
    }

    //Responsible for redrawing the rectangles each time there is an update
    boardCreation(){
        this.rects = []
        this.state.tileCanvas.ctx.clearRect(0, 0, this.state.tileCanvas.canvas.width, this.state.tileCanvas.canvas.height);
        for(var i = 0;i<this.state.board.tiles.length;i++){
            var tile = this.state.board.tiles[i]
            tile.drawImg(false,this.size,this.state.tileCanvas.ctx)
        }
        this.mapMovementEvents()
    }

    //returns whether or not a tile is within moveable range of the selected unit
    isMoveable(){
        for(var i = 0;i<this.state.board.tiles.length;i++){
            var tile = this.state.board.tiles[i]
            tile.isMoveable=false
            if(i!=this.selectionIndex){
                //left and right
                if(i>=this.selectionIndex-this.state.selectedUnit.speed && i<=this.selectionIndex+this.state.selectedUnit.speed){
                    this.state.board.tiles[i].isMoveable = true
                    this.state.board.tiles[i].drawMoveable(this.size,this.state.unitCanvas.ctx)
                }
                //have to loop through the top and bottom tiles because they are not iterative indexes
                for(var j = 1;j<=this.state.selectedUnit.speed;j++){
                    //above
                    if(i===this.selectionIndex-(this.state.board.size*j)){
                        this.state.board.tiles[i].isMoveable = true
                        this.state.board.tiles[i].drawMoveable(this.size,this.state.unitCanvas.ctx)
                    }
                    //below
                    if(i===this.selectionIndex+(this.state.board.size*j)){
                        this.state.board.tiles[i].isMoveable = true
                        this.state.board.tiles[i].drawMoveable(this.size,this.state.unitCanvas.ctx)
                    }
                    //prevents it from boxing
                    if(j!=this.state.selectedUnit.speed){
                        //top left                                                //top right
                        if(i===this.selectionIndex-(this.state.board.size*j)-1 || i===this.selectionIndex-(this.state.board.size*j)+1){
                            this.state.board.tiles[i].isMoveable = true
                            this.state.board.tiles[i].drawMoveable(this.size,this.state.unitCanvas.ctx)
                        }
                        //bottom left                                             //bottom right
                        if(i===this.selectionIndex+(this.state.board.size*j)-1 || i===this.selectionIndex+(this.state.board.size*j)+1){
                            this.state.board.tiles[i].isMoveable = true
                            this.state.board.tiles[i].drawMoveable(this.size,this.state.unitCanvas.ctx)
                        }
                    }
                }
            }
        }     
    }

    clearMoveable(){
        for(var i = 0;i<this.state.board.tiles.length;i++){
            this.state.board.tiles[i].isMoveable=false
        }
    }

     updateWindowDimensions(input) {
        var size = this.size*input
        this.setState({ width: size, height: size })
    }

    //Inits the scroll and keydown events for viewing the map
    mapMovementEvents(){
        //setting boxes to a larger or smaller setting to zoom in
        //Turning this off for now while we build some other stuff.  Will Come back to this later
        /* 
        // eslint-disable-next-line
        this.state.canvas.onwheel = (e) =>{
            e.preventDefault(); // stop the page scrolling
            if (e.deltaY < 0) {
                if(this.size < 80)
                    this.size = this.size * 1.1; // zoom in
            } else if(this.size > 35) {
                this.size = this.size * (1 / 1.1); // zoom out is inverse of zoom in
            }
            this.updateWindowDimensions(this.state.board.size)
            this.boardCreation()
        }
        */
        // eslint-disable-next-line
        this.state.tileCanvas.canvas.onkeydown = (e) =>{
            if(this.keysDown.indexOf(e.key)===-1) this.keysDown.push(e.key)
        }
        // eslint-disable-next-line
        this.state.tileCanvas.canvas.onkeyup = (e) =>{
            this.keysDown.splice(this.keysDown.indexOf(e.key),1)
        }
        
        // eslint-disable-next-line
        this.state.tileCanvas.canvas.tabIndex = 1000;
        setInterval(() => {
            var scrollX = window.scrollX
            var scrollY = window.scrollY
            var rate = 4
            
            if(this.keysDown.indexOf('a')>-1){
                scrollX-=rate
            }else if(this.keysDown.indexOf('d')>-1){
                scrollX+=rate
            }else if(this.keysDown.indexOf('w')>-1){
                scrollY-=rate
            }else if(this.keysDown.indexOf('s')>-1){
                scrollY+=rate
            }
            window.scrollTo(scrollX,scrollY)
        }, 100);
    }

    render() {
        return (
            <React.Fragment>
                <div>ID: {this.props.match.params.gameID}</div>
                <button onClick={this.leaveMatch}>Leave Match</button>
                <canvas id='canvasBoardUnit' ref='unitCanvas' width={this.state.width} height={this.state.height}></canvas>
                <canvas id='canvasBoardTile' ref='tileCanvas' width={this.state.width} height={this.state.height}></canvas>
                <button onClick={this.submitTurn} id='submitButton'>Submit</button>
                <TileData tile={this.state.selectedTile} unit={this.state.selectedUnit} size={this.size} />
            </React.Fragment>
        )
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Canvas);