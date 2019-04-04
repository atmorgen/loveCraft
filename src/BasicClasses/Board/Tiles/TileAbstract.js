import selection from './selection.png'
import moveable from './moveable.png'

export default class TileAbstract{
    constructor(x,y){
        this.position = {
            x,
            y
        }
    }

    getPosition(){
        return this.position;
    }

    setPosition(x,y){
        this.position.x = x;
        this.position.y = y;
    }

    drawImg(doHighlight,size,ctx){
        var img = new Image();
            img.src = this.img;
        
            //var highlight = doHighlight ? "brightness(150%)":"brightness(100%)";
            //ctx.filter = highlight
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
    }
}