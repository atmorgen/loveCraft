import React, { Component } from 'react';
import './TileData.css'
import _ from 'lodash';

class TileData extends Component {
    constructor(){
        super()
        this.submitMove = this.submitMove.bind(this)
        this.removeMove = this.removeMove.bind(this)
    }
    state = { 
        tileData:{
            tileName:null,
            x:null,
            y:null
        },
        
        unitData:{
            unitName:null,
            race:null,
            owner:null
        }
    }

    componentDidMount(){
        this.mouseEvents()
    }

    componentDidUpdate(){
        this.renderTileData()
        this.initTab()
    }

    mouseEvents(){
        var canvas = document.getElementById('canvasBoardTile')
        canvas.addEventListener('mousedown',(e)=>{
            this.getMousePos(e)
        })
    }

    getMousePos(e){        
        var tileBox = document.getElementById('tileDataBox')
        this.visibility()
        var x = e.clientX,
            y = e.clientY

        var xAlter = (x+tileBox.offsetWidth)>window.innerWidth/1.1 ? -(this.props.size+tileBox.offsetWidth):this.props.size
        var yAlter = (y+tileBox.offsetHeight)>window.innerHeight/1.1 ? -(this.props.size+tileBox.offsetHeight):this.props.size

        tileBox.style.left = (x+xAlter) + 'px'
        tileBox.style.top = (y+yAlter) + 'px'
        
    }

    visibility(){
        var tileBox = document.getElementById('tileDataBox')
        if(tileBox.style.display === 'none' || tileBox.style.display === "") tileBox.style.display = 'block'
    }

    closeBox(){
        var tileBox = document.getElementById('tileDataBox')
        tileBox.style.display = 'none'
        document.getElementById('unitTab').style.display = 'none'
    }

    renderTileData(){
        var tile = this.props.tile
        var unit = this.props.unit
        var unitTab = document.getElementById('unitTab')
        
        if(tile){
            var tileDataNew = {
                tileName:tile.classType,
                x:tile.getPosition().x,
                y:tile.getPosition().y,
                resouceType:this.setResourceName(tile),
                resourceCount:tile.resourceCount
            }

            if(!_.isEqual(this.state.tileData,tileDataNew)){
                this.setState({
                    tileData:tileDataNew
                })
            }
        }
        //sets up tile data for units
        if(unit && unit.unitType !== "Building"){
            unitTab.style.display = 'block'
            var unitDataNew = {
                unitName:unit.name,
                unitRace:unit.race,
                unitOwner:unit.username,
                //attack info
                unitAttackMin:unit.attack.min,
                unitAttackMax:unit.attack.max,
                //armor info
                unitArmorMin:unit.armor.min,
                unitArmorMax:unit.armor.max,
                unitHealth:unit.health,
                unitSpeed:unit.speed
            }
            
            if(!_.isEqual(this.state.unitData,unitDataNew)){
                this.setState({
                    unitData:unitDataNew
                })
            }
        //sets up tile data for buildings
        }else if(unit && unit.unitType === "Building"){
            unitTab.style.display = 'block'
            var unitDataNew = {
                unitName:unit.name,
                unitRace:unit.race,
                unitOwner:unit.username,
            }
            
            if(!_.isEqual(this.state.unitData,unitDataNew)){
                this.setState({
                    unitData:unitDataNew
                })
            }
        }else{
            unitTab.style.display = 'none';
        }
        
    }

    setResourceName(tile){
        return (tile.classType === "FertileSoil") ? "Fertility: " : (tile.classType === "Forest") ? "Wood: " : (tile.classType === "Mountain") ? "Metal: " : null
    }

    initTab(){
        var tabcontent = document.getElementsByClassName("tabcontent");
        for (var i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // Get all elements with class="tablinks" and remove the class "active"
        var tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        //Get the submit and remove buttons and set both displays to none
        var turnButtons = document.getElementsByClassName("turnButtons");
        for(i = 0;i<turnButtons.length;i++){
            turnButtons[i].style.display = 'none';
        }

        if(this.props.unit){
            if(this.props.unit.username === localStorage.getItem('username')){
                //hide/show the correct submit or remove button
                this.checkUnitForMove() ? document.getElementById('turnRemoveButton').style.display = 'block' : document.getElementById('turnSubmitButton').style.display = 'block'
            }
            document.getElementById('unitTab').className += " active";
            document.getElementById('Unit').style.display = "block";
        }else{
            document.getElementById('tileTab').className += " active";
            document.getElementById('Tile').style.display = "block";
        }
    }

    openTab(evt, input){
        // Declare all variables
        var i, tabcontent, tablinks;

        // Get all elements with class="tabcontent" and hide them
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // Get all elements with class="tablinks" and remove the class "active"
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(input).style.display = "block";
        evt.currentTarget.className += " active";
    }

    submitMove(){
        if (typeof this.props.onSubmit === 'function') {
            this.props.onSubmit(this.props.move);
        }
    }

    removeMove(){
        if (typeof this.props.onSubmit === 'function') {
            this.props.onRemove(this.props.move);
        }
    }

    checkUnitForMove(){
        
        if(this.props.move[2]){
            for(var i = 0;i<this.props.move[1].moves.length;i++){
                var move = this.props.move[1].moves[i].move
                if(move.unit.unitUID === this.props.move[2].unitUID){
                    return true                    
                }
            }
            return false
        }
    }

    render() { 
        return (
            <div id='tileDataBox'>
                <div id='topHeader'>
                    <div onClick={this.closeBox} id='clsBtn'>&times;</div>
                    <button id='tileTab' className="tablinks" onClick={(event)=>this.openTab(event, 'Tile')} >Tile</button>
                    <button id='unitTab' className="tablinks" onClick={(event)=>this.openTab(event, 'Unit')} >Unit</button>
                </div>

                <div id="Tile" className="tabcontent">
                    <h3>{this.state.tileData.tileName}</h3>
                    <p>{this.state.tileData.resouceType} {this.state.tileData.resourceCount}</p>
                </div>

                <div id="Unit" className="tabcontent">
                    <h5>Owner: {this.state.unitData.unitOwner}</h5>
                    <h3 id='unitName'>{this.state.unitData.unitName}</h3>
                    
                    <div id='raceTag'>Race: {this.state.unitData.unitRace}</div> 
                    <p>Health: {this.state.unitData.unitHealth}</p>
                    <p>Attack: {this.state.unitData.unitAttackMin} - {this.state.unitData.unitAttackMax}</p>
                    <p>Armor: {this.state.unitData.unitArmorMin} - {this.state.unitData.unitArmorMax}</p>
                    <p>Speed: {this.state.unitData.unitSpeed}</p>
                    <button className="turnButtons" id='turnSubmitButton' onClick={this.submitMove}>Submit</button>
                    <button className="turnButtons" id='turnRemoveButton' onClick={this.removeMove}>Remove</button>
                </div>
            </div>
        );
    }
}
 
export default TileData;