import { WaterTile, FertileSoil, MountainTile, ForestTile } from './Tiles'

class BoardRNG {

    constructor(size){
        this.tileCollection = [WaterTile,FertileSoil,MountainTile,ForestTile];
        this.size = size;

        this.landMass = Math.pow(this.size,2)
        this.rngCount = 0;
        this.rngRounds = 0;

        //water
        this.waterRatio =.25
        this.waterMass = Math.floor(this.landMass*this.waterRatio)
        this.chanceOfWater = 4
        //mountain
        this.mountainRatio =.15
        this.mountainMass = Math.floor(this.landMass*this.mountainRatio)
        this.chanceOfMountain = 2
        //forest
        this.forestRatio =.35
        this.forestMass = Math.floor(this.landMass*this.forestRatio)
        this.chanceOfForest = 2
    } 

    BoardDecision(){
        this.tiles = new Array(this.landMass)

        while(this.rngRounds < 15){
            var rngStart = this.getCoordsFromLocation(this.randomIntFromInterval(0,this.landMass))
            
            var focusedTile = this.rngDecisions(rngStart.x,rngStart.y,rngStart.location)
            this.surroundingTiles(focusedTile)
            this.rngCount = 0;
            this.rngRounds++;
        }
        
        this.finalCheck()
        return this.tiles;
    }

    surroundingTiles(rngDecision){

        var surroundingTiles = rngDecision.surrounding.empty
        if(this.updateRNGCount()) return

        for(var i = 0;i<surroundingTiles.length;i++){
            var surroundTile = surroundingTiles[i],
                coords = this.getCoordsFromLocation(surroundTile),
                decision = this.rngDecisions(coords.x,coords.y,coords.location)
            
            this.updateMassCounts(decision.tile)
            if(!this.tiles[coords.location]) this.tiles[coords.location] = decision.tile
            this.surroundingTiles(decision)            
        }
    }

    updateRNGCount(){
        var max = this.rngCount > 10
        
        if(max){
            return true
        }else{
            this.rngCount++
            return false
        }
        
    }

    updateMassCounts(tile){
        if(tile instanceof WaterTile && this.waterMass > 0) this.waterMass--
        else if(tile instanceof ForestTile && this.forestMass > 0) this.forestMass--
        else if(tile instanceof MountainTile && this.mountainMass > 0) this.mountainMass--
    }

    finalCheck(){
        for(var i = 0;i<this.tiles.length;i++){
            var tile = this.tiles[i]
            if(tile===undefined){
                var coords = this.getCoordsFromLocation(i)
                this.tiles[i] = this.rngDecisions(coords.x,coords.y,coords.location).tile
            }
        }
    }

    rngDecisions(x,y,location){
        var surroundingTiles = this.getSurroundingTiles(location);
        var tileRNGCollection = [FertileSoil];
        
        //for surrounding tiles that have a value
        if(surroundingTiles.full.length>0){
            for(var i = 0;i<surroundingTiles.full.length;i++){
                var tile = this.tiles[surroundingTiles.full[i]]
                
                if(tile instanceof WaterTile && this.waterMass > 0){
                    for(var j = 0;j<this.chanceOfWater;j++){
                        tileRNGCollection.push(WaterTile)
                    }
                }else if(tile instanceof MountainTile && this.mountainMass > 0){
                    for(var k = 0;k<this.chanceOfMountain;k++){
                        tileRNGCollection.push(MountainTile)
                    }
                }else if(tile instanceof ForestTile && this.forestMass > 0){
                    for(var l = 0;l<this.chanceOfForest;l++){
                        tileRNGCollection.push(ForestTile)
                    }
                }else{
                    if(this.waterMass > 0){
                        tileRNGCollection.push(WaterTile)
                    }
                    if(this.mountainMass > 0){
                        tileRNGCollection.push(MountainTile)
                    }
                    if(this.forestMass > 0){
                        tileRNGCollection.push(ForestTile)
                    }
                }
            }
        }else{
            tileRNGCollection.push(WaterTile)
            tileRNGCollection.push(MountainTile)
            tileRNGCollection.push(ForestTile)
        }
        return {
                    tile:new tileRNGCollection[this.getRandomIndex(tileRNGCollection)](x,y),
                    surrounding:surroundingTiles
                }
    }

    //gets random index position of input
    getRandomIndex(input){
        return Math.floor(Math.random()*input.length);
    }

    randomIntFromInterval(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    getCoordsFromLocation(location){
        return {
            x:location%this.size,
            y:Math.floor(location/this.size),
            location:location
        }
    }

    getSurroundingTiles(location){
        var surroundingEmpty = [],
            surroundingFull = [],
            surroundingTotal = []
        var tilesIndex = location;
        var positions = [
            tilesIndex-1,
            tilesIndex+1,
            tilesIndex+this.size-1,
            tilesIndex+this.size,
            tilesIndex+this.size+1,
            tilesIndex-this.size,
            tilesIndex-this.size-1,
            tilesIndex-this.size+1
        ]

        for(var i = 0;i<positions.length;i++){
            if(this.withinIndex(positions[i])){
                if(this.isFull(positions[i])){
                    surroundingFull.push(positions[i])
                }else{
                    surroundingEmpty.push(positions[i])
                }
                surroundingTotal.push(positions[i])
            }
        }

        return {
            full:surroundingFull,
            empty:surroundingEmpty
        }
    }

    isFull(index){
        if(this.tiles[index]){
            return true
        }
        return false
    }

    withinIndex(input){
        return (input > 0 && input < this.tiles.length)
    }

}
 
export default BoardRNG;