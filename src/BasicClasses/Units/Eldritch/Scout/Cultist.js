import eldritchscout from './eldritchscout.png';
import UnitAbstract from '../../UnitAbstract';

class Cultist extends UnitAbstract{
    constructor(uid,size,x,y,context,canvas){
        super()
        //////This is the units game information
        this.owner = uid
        this.name = "Cultist"
        this.race = "Eldritch"
        this.type = "Scout"
        this.health = 100
        this.attack = {
            min:5,
            max:8
        }
        this.armor = {
            min:6,
            max:9
        }
        this.speed = 2

        //////This is all information for rendering the unit on the page//////
        this.state = {
            size: size
        }
        this.img = eldritchscout
        this.position = {
            x:x,
            y:y
        }
        this.context = context
        this.canvas = canvas
        this.bitMapLength = 2

        //these should match the size of each SEPERATE image on the bitmap, i.e. if it's three 32x32 images on the bitmap then the spriteWidth and spriteHeight should be 32
        this.spriteWidth  = 188
        this.spriteHeight = 188

        //These determine where we are looking on the actual bitmap image.  If it's top to bottom and the images are 32x32 then to go to the next image you will set pixelsTop
        //to ```pixelsTops+=spriteHeight``` to get to the next image
        this.pixelsLeft   = 0
        this.pixelsTop    = 0

        //animation interval
        this.interval = null

        this.drawImage()
    }

    getOwner(){
        return this.owner;
    }

    setOwner(input){
        this.owner = input
    }

    

    getImage(){
        return this.img
    }

}
 
export default Cultist;