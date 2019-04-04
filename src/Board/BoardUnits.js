import EldritchGrunt from '../BasicClasses/Units/Eldritch/Warrior/Basic/EldritchGrunt'
import { Firestore } from '../Firebase/Firestore';
import _ from 'lodash';

import TileData from './TileData/TileData';

//For move submission
import TurnSubmission from '../BasicClasses/Match/TurnSubmission';
import Move from '../BasicClasses/Match/Move';

class BoardUnits{
    
    constructor(context,canvas,matchID,uid){
        this.state = {
            ctx:context,
            canvas:canvas
        }
        this.firestore = new Firestore()
        this.matchdID = matchID
        this.uid = uid
        this.units = []
        this.tileData = new TileData()
        //for move submissions
        this.turnSubmission = new TurnSubmission()
        this.unitCreation(new EldritchGrunt(this.uid,this.size,4,4,this.state.ctx,this.state.canvas),this.matchdID)

        this.eldritchTypes = [
            EldritchGrunt
        ]

        this.humanTypes = [

        ]

        this.druidTypes = [

        ]
    }
    
    renderUnits(size,units){
        this.state.ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
        for(var i = 0;i<units.length;i++){
            units[i].state.size = size
            units[i].drawImage()
        } 
    }

    async unitCreation(unit,matchID){
        var matchUnits = JSON.parse(await this.firestore.getUnitsFromMatch(matchID))
        matchUnits.push({
            unitUID:unit.unitUID,
            owner:unit.owner,
            username:localStorage.getItem('username'),
            race:unit.race,
            name:unit.name,
            position:{
                x:unit.position.x,
                y:unit.position.y
            },
            speed:unit.speed,
            health:unit.health,
            attack:unit.attack,
            armor:unit.armor
        })
        this.firestore.addUnitsToMatch(this.matchdID,JSON.stringify(matchUnits))
    }

    reClassifyUnits(board){
        var units = JSON.parse(board.units)
        board.clearUnits()
        for(var i = 0;i<units.length;i++){
            var unit = units[i]
            
            if(unit.race === "Eldritch"){
                for(var j = 0;j<this.eldritchTypes.length;j++){
                    if(this.eldritchTypes[j].name === unit.name.replace(/\s/g,'')){
                        board.addUnit(new this.eldritchTypes[j](this.uid,null,unit.position.x,unit.position.y,this.state.ctx,this.state.canvas))
                        break;
                    }
                }
            }else if(unit.race === "Human"){
                for(j = 0;j<this.humanTypes.length;j++){
                    if(this.humanTypes[j].name === unit.name.replace(/\s/g,'')){
                        board.addUnit(new this.humanTypes[j](this.uid,null,unit.position.x,unit.position.y,this.state.ctx,this.state.canvas))
                        break;
                    }
                }
            }else if(unit.race === "Druid"){
                for(j = 0;j<this.druidTypes.length;j++){
                    if(this.druidTypes[j].name === unit.name.replace(/\s/g,'')){
                        board.addUnit(new this.druidTypes[j](this.uid,null,unit.position.x,unit.position.y,this.state.ctx,this.state.canvas))
                        break;
                    }
                }
            }

        }
        this.units = units;
        return board
    }

    async moveUnit(matchID,unit,x,y){
        var matchUnits = JSON.parse(await this.firestore.getUnitsFromMatch(matchID))
        var correctUnit = matchUnits.filter(x =>
            x.unitUID === unit.unitUID
        )
        correctUnit[0].position.x = x
        correctUnit[0].position.y = y

        //await this.firestore.addUnitsToMatch(this.matchdID,JSON.stringify(matchUnits))

        if(this.turnSubmission.getMoves().length<3){
            this.turnSubmission.addMove(new Move(correctUnit[0],x,y))
        }else{
            console.log('already submitted 3 moves!')
        }
        this.tileData.closeBox()
    }

    //submits turn to the server
    submitTurn(){
        this.turnSubmission.submitTurn(this.matchdID,this.uid)
    }

    moveImage(unit,x,y,stepsTop){
        //init new image and add source
        var img = new Image();
            img.src = unit.img;

        var steps = 0
        var moveInterval = setInterval(() => {
            this.boardCreation()
            this.renderUnits(unit)
            unit.context.drawImage(img,
                unit.pixelsLeft,
                //this pushes image down to the next bitmap image
                unit.pixelsTop,
                unit.spriteWidth,
                unit.spriteHeight,
                unit.positions.x+=x,
                unit.positions.y+=y,
                unit.width,
                unit.height
            );
            steps++;
            if(steps>=stepsTop) clearInterval(moveInterval)
        }, 1000);
    }

    //finds the unit at the selected tile and returns it to board.js
    getUnitAtSelectedTile(tile){
        var position = {
            x:tile.position.x,
            y:tile.position.y
        }
        var unit = this.units.filter(unit =>
            _.isEqual(unit.position,position)
        )
        return unit[0]
    }

}
 
export default BoardUnits;