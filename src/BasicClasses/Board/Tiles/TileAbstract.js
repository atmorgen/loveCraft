import selection from './selection.png'
import moveable from './moveable.png'
import moving from './moving.png'

export default class TileAbstract{
    constructor(x,y){
        this.position = {
            x,
            y
        }
        this.isMoveable = false
        this.movingTo = false
    }

    getPosition(){
        return this.position;
    }

    setPosition(x,y){
        this.position.x = x;
        this.position.y = y;
    }

    getIsMoveable(){
        return this.isMoveable;
    }

    setIsMoveableToTrue(){
        this.isMoveable = true;
    }

    setIsMoveableToFalse(){
        this.isMoveable = false;
    }

    getMovingTo(){
        return this.movingTo;
    }

    setMovingToToTrue(){
        this.movingTo = true;
    }

    setMovingToToFalse(){
        this.movingTo = false;
    }

    drawImg(size,ctx){
        var img = new Image();
            img.src = this.img;
                
        img.onload = () =>{
                ctx.drawImage(img,
                    0,
                    0,
                    this.imgSize,
                    this.imgSize,
                    this.position.x*size,
                    this.position.y*size,
                    size,
                    size
                );
        }
    }

    drawSelection(size,ctx){
        var img = new Image();
            img.src = selection

        img.onload = () => {
            ctx.drawImage(img,
                0,
                0,
                32,
                32,
                this.position.x*size,
                this.position.y*size,
                size,
                size
            );
        }
    }

    drawMoveable(size,ctx){
        if(!this.getMovingTo()){
            var img = new Image();
            img.src = moveable

            img.onload = () => {
                ctx.drawImage(img,
                    0,
                    0,
                    32,
                    32,
                    this.position.x*size,
                    this.position.y*size,
                    size,
                    size
                );
            }
            this.setIsMoveableToTrue()
        } 
    }

    drawMoving(size,ctx){
        var img = new Image();
            img.src = moving
        
        img.onload = () => {
            ctx.drawImage(img,
                0,
                0,
                32,
                32,
                this.position.x*size,
                this.position.y*size,
                size,
                size
            );
        }
        this.setMovingToToTrue()
    }
}