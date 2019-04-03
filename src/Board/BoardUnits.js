import EldritchGrunt from '../BasicClasses/Units/Eldritch/Warrior/Basic/EldritchGrunt'
import { Firestore } from '../Firebase/Firestore';

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
        this.unitCreation(new EldritchGrunt(this.uid,this.size,4,4,this.state.ctx,this.state.canvas),this.matchdID)

        this.eldritchTypes = [
            EldritchGrunt
        ]
    }
    
    renderUnits(size,units){
        for(var i = 0;i<units.length;i++){
            units[i].state.size = size
            units[i].drawImage()
        }
        
    }

    async unitCreation(unit,matchID){
        var matchUnits = JSON.parse(await this.firestore.getUnitsFromMatch(matchID))

        matchUnits.push({
            owner:unit.owner,
            race:unit.race,
            name:unit.name,
            position:{
                x:unit.positions.x,
                y:unit.positions.y
            }
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

            }else{

            }

        }
        return board
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


}
 
export default BoardUnits;