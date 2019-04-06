import EldritchGrunt from '../BasicClasses/Units/Eldritch/Warrior/Basic/EldritchGrunt'
import { Firestore } from '../Firebase/Firestore';
import _ from 'lodash';

import TileData from './TileData/TileData';

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
        //this.unitCreation(new EldritchGrunt(this.uid,this.size,4,4,this.state.ctx,this.state.canvas),this.matchdID)

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

    renderDrawMoving(size,tiles){
        for(var j = 0;j<tiles.length;j++){
            var drawingTile = tiles[j];
            if(drawingTile.getMovingTo()){
                drawingTile.drawMoving(size,this.state.ctx)
            } 
        }
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