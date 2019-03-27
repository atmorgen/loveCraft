import React, { Component } from 'react';
import './Board.css';
//For Testing
import BoardClass from '../BasicClasses/Board/BoardClass';
import { Firestore } from '../Firebase/Firestore';

export default class Canvas extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            width: 0, 
            height: 0,
            canvas:null,
            ctx: null
        }
        this.size = 100;

        //Bindings
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.tileSelect = this.tileSelect.bind(this);
        //Firestore
        this.id = this.props.match.params.gameID;
        //this.gameInit();

        //Board Information
        this.rects = []

        this.selectionIndex = null
    }

    //examples for now to mess around with
    async gameInit(){
        let testBoard = new BoardClass(this.id,20);
        var firestore = new Firestore();
        firestore.setNewDoc(this.id,testBoard);
        
        // eslint-disable-next-line
        var data = await firestore.docSubscription(this.id)
        //Object.assign(new BoardClass(), JSON.parse(data.Board))
        var obj = testBoard

        this.setState({board: obj})
        this.updateWindowDimensions(this.state.board.size)

        this.setState(
            {
                ctx:this.refs.canvas.getContext('2d'),
                canvas:this.refs.canvas
            })
        
        this.boardCreation(null)
        this.tileSelect();
    }
    test = 1
    boardCreation(){
        var ctx = this.state.ctx;
        var tiles = this.state.board.tiles
        this.rects = []
        
        ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
        for(var i = 0;i<tiles.length;i++){
            var tile = tiles[i]
            var strokeColor = this.selectionIndex === i ? 'red':'black';
            var borderWidth = this.selectionIndex === i ? 4:2.2;
            var rectTile = {
                ctx, 
                x:(this.size*tile.position.x), 
                y:(this.size*tile.position.y), 
                color:tile.color, 
                stroke:strokeColor,
                border:borderWidth
            }
            this.rects.push(rectTile)
            this.rect(rectTile,this.size)
        }
        
        //setting boxes to a larger or smaller setting to zoom in
        // eslint-disable-next-line
        this.state.canvas.onwheel = (e) =>{
            e.preventDefault(); // stop the page scrolling
            if (e.deltaY < 0) {
                this.size = this.size * 1.1; // zoom in
            } else {
                this.size = this.size * (1 / 1.1); // zoom out is inverse of zoom in
            }
            this.updateWindowDimensions(this.state.board.size)
            this.boardCreation()
        }

        //scrolling around the page
        // eslint-disable-next-line
        this.state.canvas.tabIndex = 1000;
        // eslint-disable-next-line
        this.state.canvas.onkeydown = (e) =>{
            var key = e.key
            var scrollX = window.scrollX
            var scrollY = window.scrollY
            var rate = 25
            
            if(key === 'a'){
                scrollX-=rate
            }else if(key === 'd'){
                scrollX+=rate
            }else if(key === 'w'){
                scrollY-=rate
            }else if(key === 's'){
                scrollY+=rate
            }
            window.scrollTo(scrollX,scrollY)
        }
    }

    rect(props,size) {
        const {ctx, x, y, color, stroke, border} = props;
        ctx.rect(x,y,size,size);

        ctx.beginPath()
        ctx.fillStyle=color;
        
        ctx.fillRect(x,y,size,size);
        
        ctx.lineWidth=border;
        ctx.strokeStyle=stroke;
        ctx.strokeRect(x,y,size,size);
    }

    tileSelect(){
        // eslint-disable-next-line
        console.log('asdf')
        this.state.canvas.onmousedown= (e)=>{

            var clientRect = this.state.canvas.getBoundingClientRect(),
            x = e.clientX - clientRect.left,
            y = e.clientY - clientRect.top
            for(var i = 0;i<this.rects.length;i++){
                var rect = this.rects[i];
                if(this.withinTile(rect,x,y)) {
                    this.selectionIndex = i;
                    break;
                }  
            }
            this.boardCreation()
            var tiles = this.state.board.tiles;
            console.log(tiles[this.selectionIndex])
        }
    }

    withinTile(tile,x,y){
        if(x >= tile.x && y >= tile.y){
            if(x <= (tile.x+this.size) && y <= (tile.y+this.size)){
                return true;
            }
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
                <canvas id='canvasBoard' ref='canvas' width={this.state.width} height={this.state.height}></canvas>
            </React.Fragment>
        )
    }
}