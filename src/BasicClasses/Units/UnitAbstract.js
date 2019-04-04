export default class Unit{

    constructor(){
        this.unitUID = this.getRandomID()
    }

    getRandomID(){
        return '_' + Math.random().toString(36).substr(1, 11);
    }

    getUnitUID(){
        return this.unitUID;
    }

    drawImage(){
        var img = new Image();
            img.src = this.img;
        
        img.onload = () =>{
            this.context.drawImage(img,
                this.pixelsLeft,
                this.pixelsTop,
                this.spriteWidth,
                this.spriteHeight,
                this.position.x*this.state.size + this.state.size*.1,
                this.position.y*this.state.size + this.state.size*.1,
                this.state.size*.8,
                this.state.size*.8
            );
        }
        
    }

}