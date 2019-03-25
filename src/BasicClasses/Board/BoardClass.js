import BoardRNG from './BoardRNG';

/* Basic Class for Instantiating a new Board */
export default class BoardClass{

    constructor(boardID, size){
        this.boardID = boardID;
        this.size = size;
        this.units = [];
        this.tiles = [];

        this.initBoard();
    }

    initBoard(){
        //generates a board of random tiles out of the tileCollection array above
        var rng = new BoardRNG(this.size);        
        this.tiles = rng.BoardDecision();
    }

    //gets random index position of input
    getRandomTile(input){
        return Math.floor(Math.random()*input.length);
    }

    getBoardID(){
        return this.boardID;
    }

    setBoardID(input){
        this.boardID = input;
    }

    //Gets unit based on unitID
    getUnit(input){
        return this.units.find(x =>{
            return x.unitID === input;
        })
    }

    getUnits(){
        return this.units;
    }

    addUnit(input){
        this.units.push(input);
    }

    removeUnit(input){
        this.units.splice(this.units.indexOf(input),1);
    }

    clearUnits(){
        this.units = [];
    }

    getTiles(){
        return this.tiles;
    }

    addTile(input){
        this.tiles.push(input);
    }

    removeTile(input){
        this.tiles.splice(this.tiles.indexOf(input),1);
    }

    clearTiles(){
        this.tiles = [];
    }

}