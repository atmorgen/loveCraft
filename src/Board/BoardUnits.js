//Unit Imports for now until indexes are set up

//Druids
import SwineKnight from '../BasicClasses/Units/Druid/Soldier/SwineKnight';
import DruidGatherer from '../BasicClasses/Units/Druid/Gatherer/DruidGatherer';

//Eldritch
import EldritchGrunt from '../BasicClasses/Units/Eldritch/Warrior/Basic/EldritchGrunt';
import Cultist from '../BasicClasses/Units/Eldritch/Scout/Cultist';

//Humans
import MainTown from '../BasicClasses/Units/Human/Buildings/MainTown/MainTown';

import { Firestore } from '../Firebase/Firestore';
import _ from 'lodash';

import TileData from './TileData/TileData';

/* This class is responsible for creation of new units, reclassifying units being pull from firebase and any other small methods needed in regards to units */

class BoardUnits{
    
    constructor(matchID,uid,size){
        //bindings 
        this.unitCreation = this.unitCreation.bind(this)
        this.state = {
            ctx:document.getElementById('canvasBoardUnit').getContext('2d'),
            canvas:document.getElementById('canvasBoardUnit')
        }
        this.firestore = new Firestore()
        this.matchID = matchID
        this.uid = uid
        this.units = []
        this.size = size
        this.tileData = new TileData()

        this.eldritchTypes = [
            EldritchGrunt,
            Cultist
        ]

        this.humanTypes = [
            MainTown
        ]

        this.druidTypes = [
            DruidGatherer,
            SwineKnight
        ]
    }
    
    renderUnits(units){
        this.state.ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
        for(var i = 0;i<units.length;i++){
            units[i].state.size = this.size
            units[i].drawImage()
        } 
    }

    async unitCreation(unit){
        var matchUnits = JSON.parse(await this.firestore.getUnitsFromMatch(this.matchID))
        matchUnits.push({
            unitUID:unit.unitUID,
            owner:unit.owner,
            username:(await this.firestore.getUserName(unit.owner)),// localStorage.getItem('username'),
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
        this.firestore.addUnitsToMatch(this.matchID,JSON.stringify(matchUnits))
    }

    reClassifyUnits(board){
        var units = JSON.parse(board.units)
        board.clearUnits()
        for(var i = 0;i<units.length;i++){
            var unit = units[i]
            if(unit.race === "Eldritch"){
                for(var j = 0;j<this.eldritchTypes.length;j++){
                    var classInitEldritch = new this.eldritchTypes[j](this.uid,null,unit.position.x,unit.position.y,this.state.ctx,this.state.canvas)
                    if(classInitEldritch.name.replace(/\s/g,'') === unit.name.replace(/\s/g,'')){
                        board.addUnit(classInitEldritch)
                        break;
                    }
                }
            }else if(unit.race === "Human"){
                for(j = 0;j<this.humanTypes.length;j++){
                    var classInitHuman = new this.humanTypes[j](this.uid,null,unit.position.x,unit.position.y,this.state.ctx,this.state.canvas)
                    if(classInitHuman.name.replace(/\s/g,'') === unit.name.replace(/\s/g,'')){
                        board.addUnit(classInitHuman)
                        break;
                    }
                }
            }else if(unit.race === "Druid"){
                for(j = 0;j<this.druidTypes.length;j++){
                    var classInitDruid = new this.druidTypes[j](this.uid,null,unit.position.x,unit.position.y,this.state.ctx,this.state.canvas)
                    if(classInitDruid.name.replace(/\s/g,'') === unit.name.replace(/\s/g,'')){
                        board.addUnit(classInitDruid)
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