export default class Match{
    
    constructor(board){
        this.board = board;
        this.players = [];
    }

    getBoard(){
        return this.board;
    }

    setBoard(input){
        this.board = input;
    }

    getPlayers(){
        return this.players;
    }

    addPlayer(input){
        this.players.push(input);
    }
    
    removePlayer(input){
        this.players.splice(this.players.indexOf(input),1);
    }

    clearPlayers(){
        this.players = [];
    }

}