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

    drawImage(doHighlight,size,ctx){
        var img = new Image();
            img.src = this.img;
        
            var highlight = doHighlight ? "brightness(150%)":"brightness(100%)";
            ctx.filter = highlight
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