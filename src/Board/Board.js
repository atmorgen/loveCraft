import React, { Component } from 'react';
import './Board.css';

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
            height: 0,
            canvas:null,
            ctx: null,
            selectedTile: null
        }
        this.size = 35;
        //Bindings
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.tileSelect = this.tileSelect.bind(this);
        this.leaveMatch = this.leaveMatch.bind(this)
        //Firestore
        this.firestore = new Firestore()
        this.id = this.props.match.params.gameID;
        this.db = firebase.firestore()
        this.matchID=null
        this.uid=null
        //Board Information
        this.rects = []
        this.tiles = []
        //Units Information
        this.BoardUnits = null
        //For Tile Selection
        this.selectionIndex = null
        //Get list of keys held down
        this.keysDown = []
        //Functions
        this.boardFunctions = new BoardFunctions(this.state.ctx,this.state.canvas)
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
                    ctx:this.refs.canvas.getContext('2d'),
                    canvas:this.refs.canvas
                })
            //creates the units on the board
            this.BoardUnits = new BoardUnits(this.state.ctx,this.state.canvas,this.matchID,this.uid)
            //reclassifies tiles
            var boardReclassified = this.boardFunctions.reClassifyBoard(matchInfo.board)
            //reclassifies units
            boardReclassified = this.BoardUnits.reClassifyUnits(boardReclassified)
            //sets board state
            this.setState({board: boardReclassified})
            //updates the size of the board to match the total size of all the rects in the canvas
            this.updateWindowDimensions(this.state.board.size)
            //creates the boards
            this.boardCreation()
            //inits the tileSelection events
            this.tileSelect();
            //Sets subscription events for rest of the match
            this.boardSubscription()
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
    boardSubscription(){
        this.db.collection(DB.MATCHES).doc(this.id)
            .onSnapshot((doc)=>{
                if(doc.data() !== undefined){
                    //setting board state
                    var reclassedBoard = this.boardFunctions.reClassifyBoard(doc.data().board)
                    reclassedBoard = this.BoardUnits.reClassifyUnits(reclassedBoard)
                    this.setState({board: reclassedBoard})
                    //rerunning board creation
                    this.boardCreation();
                }else{
                    this.leaveMatch()
                }
            })
    }

    //Responsible for redrawing the rectangles each time there is an update
    boardCreation(){
        this.tiles = this.state.board.tiles
        this.rects = []
        this.state.ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
        for(var i = 0;i<this.tiles.length;i++){
            var tile = this.tiles[i]
            //console.log(tile.getPosition().x,tile.getPosition().y,tile)
            var strokeColor = this.selectionIndex === i ? 'red':'black';
            var borderWidth = this.selectionIndex === i ? 4:.5;
            var rectTile = {
                ctx:this.state.ctx, 
                x:(this.size*tile.getPosition().x), 
                y:(this.size*tile.getPosition().y),
                stroke:strokeColor,
                border:borderWidth,
                image:tile.getImage(),
                imageSize:tile.getImageSize()
            }
            this.rects.push(rectTile)
            this.boardFunctions.rect(rectTile,this.size)
        }
        this.mapMovementEvents()
        //Testing for unit creation on the board
        this.BoardUnits.renderUnits(this.size,this.state.board.units)
    }

    tileSelect(){
        // eslint-disable-next-line
        this.state.canvas.onmousedown= (e)=>{
            var clientRect = this.state.canvas.getBoundingClientRect(),
            x = e.clientX - clientRect.left,
            y = e.clientY - clientRect.top
            for(var i = 0;i<this.rects.length;i++){
                var rect = this.rects[i];
                if(this.boardFunctions.withinTile(rect,x,y,this.size)) {
                    this.selectionIndex = i;
                    break;
                }  
            }
            this.boardCreation()
            this.setState({
                selectedTile:this.tiles[i]
            })
        }
    }

     updateWindowDimensions(input) {
        var size = this.size*input
        this.setState({ width: size, height: size })
    }

    //Inits the scroll and keydown events for viewing the map
    mapMovementEvents(){
        //setting boxes to a larger or smaller setting to zoom in
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

        // eslint-disable-next-line
        this.state.canvas.onkeydown = (e) =>{
            if(this.keysDown.indexOf(e.key)===-1) this.keysDown.push(e.key)
        }
        // eslint-disable-next-line
        this.state.canvas.onkeyup = (e) =>{
            this.keysDown.splice(this.keysDown.indexOf(e.key),1)
        }
        
        // eslint-disable-next-line
        this.state.canvas.tabIndex = 1000;
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
                <canvas id='canvasBoard' ref='canvas' width={this.state.width} height={this.state.height}></canvas>
                <TileData tile={this.state.selectedTile} size={this.size} />
            </React.Fragment>
        )
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Canvas);