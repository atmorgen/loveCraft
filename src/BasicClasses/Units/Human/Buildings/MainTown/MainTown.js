import building from './building.png'
import UnitAbstract from '../../../UnitAbstract';

class MainTown extends UnitAbstract{
    constructor(uid,size,x,y,context,canvas){
        super()
        //////This is the units game information
        this.owner = uid
        this.name = "Main Town"
        this.race = "Human"
        this.type = "Building"

        //////This is all information for rendering the unit on the page//////
        this.state = {
            size: size
        }
        
        this.img = building
        this.position = {
            x:x,
            y:y
        }
        this.context = context
        this.canvas = canvas
        this.bitMapLength = 2

        //these should match the size of each SEPERATE image on the bitmap, i.e. if it's three 32x32 images on the bitmap then the spriteWidth and spriteHeight should be 32
        this.spriteWidth  = 1280
        this.spriteHeight = 1280

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
 
export default MainTown;