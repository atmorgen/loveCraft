import EldritchGrunt from '../BasicClasses/Units/Eldritch/Warrior/Basic/EldritchGrunt'
import { Firestore } from '../Firebase/Firestore';

class BoardUnits{
    
    constructor(context,canvas,matchID){
        this.state = {
            ctx:context,
            canvas:canvas
        }
        this.firestore = new Firestore()
        this.matchdID = matchID
        this.units = []
        this.unitCreation(new EldritchGrunt(this.size,4,4,this.state.ctx,this.state.canvas),this.matchdID)
    }
    
    renderUnits(size,units){
        
        /*
        for(var i = 0;i<units.length;i++){
            units[i].state.size = size
            units[i].drawImage()
        }
        */
    }

    async unitCreation(unit,matchID){
        var matchUnits = JSON.parse(await this.firestore.getUnitsFromMatch(matchID))
        console.log(matchUnits)

        /*
        var toDB = {
            name:unit.name,
            position:{
                x:unit.positions.x,
                y:unit.positions.y
            }
        }

        var second = {
            name:unit.name,
            position:{
                x:15,
                y:4
            }
        }

        matchUnits.push(toDB)
        matchUnits.push(second)

        */
        this.firestore.addUnitsToMatch(this.matchdID,JSON.stringify(matchUnits))
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