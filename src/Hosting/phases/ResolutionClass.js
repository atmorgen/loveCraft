import HostingFirestore from '../HostingFirestore';
import Firestore from '../../Firebase/Firestore/firestore';
import * as DB from '../../Firebase/Firestore/DB';
import firebase from 'firebase';


/* This class is responsible for resolving turn submissions in the matches */

export default class ResolutionClass{

    constructor(matchID){
        this.submission=null
        this.matchID = matchID
        this.name = "Resolution"
        //firebase stuff
        this.hostingFirestore = new HostingFirestore()
        this.firestore = new Firestore()
        this.db = firebase.firestore()
        console.log("Resolution Phase Start")
        this.turnResolution()
        this.interval = null
    }

    

    async turnResolution(){
        var turnSubmissions = await this.hostingFirestore.getTurnSubmissions(this.matchID)
        var units = JSON.parse(await this.firestore.getUnitsFromMatch(this.matchID))
        var resolutionRound = 0

            //This is the interval for moving units around the map.  ToDo: need to add a check to see if these units are doing something other than just moving.
            this.interval = setInterval(async () => {
                var toRemove = []
                var subLength = turnSubmissions.length
                for(var i = 0;i<subLength;i++){
                    var playerSub = JSON.parse(turnSubmissions[i]).moves
                    var playerSubLength = playerSub.length
                    for(var j = 0;j<playerSubLength;j++){
                        var playerMoves = playerSub[j].move
                        var move = playerMoves.moves[resolutionRound]
               
                        
                        var targetUnit = units.filter(x =>
                            x.unitUID === playerMoves.unit.unitUID
                        )[0]

                        if(move){
                            var x = move.x,
                                y = move.y
                            if(targetUnit){
                                targetUnit.position.x = x
                                targetUnit.position.y = y

                                units.filter(x =>
                                    x.unitUID === playerMoves.unit.unitUID
                                )[0] = targetUnit
                            }
                        }else{
                            toRemove.push(i)
                        }
                    }
                }
                await this.firestore.addUnitsToMatch(this.matchID,JSON.stringify(units))

                
                for(var i = 0;i<toRemove.length;i++){
                    turnSubmissions.splice(toRemove[i],1)
                }
                if(turnSubmissions.length === 0){
                    await this.hostingFirestore.clearTurnSubmissions(this.matchID)
                    await this.setPhaseToUpkeep()
                    clearInterval(this.interval)
                }
                resolutionRound++
            }, 1000);    
    }

    checkIfCombat(){
        return new Promise((resolve)=>{


            resolve()
        })
    }

    setPhaseToUpkeep(){
        return new Promise((resolve)=>{
            this.db.collection(DB.MATCHES).doc(this.matchID).update({
                phase:"Upkeep",
                subphase:"Resources"
            }).then(function(){
                resolve()
            })
        })
    }


}