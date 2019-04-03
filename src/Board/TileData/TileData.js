import React, { Component } from 'react';
import './TileData.css'
import _ from 'lodash';

class TileData extends Component {
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
        var canvas = document.getElementById('canvasBoard')
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
        if(tileBox.style.visibility === '' || tileBox.style.visibility === 'hidden') tileBox.style.visibility = 'visible'
    }

    closeBox(){
        var tileBox = document.getElementById('tileDataBox')
        tileBox.style.visibility = 'hidden' 
    }

    renderTileData(){
        var tile = this.props.tile
        var unit = this.props.unit
        var unitTab = document.getElementById('unitTab')
        
        if(tile){

            var tileDataNew = {
                tileName:tile.classType,
                x:tile.getPosition().x,
                y:tile.getPosition().y
            }

            if(!_.isEqual(this.state.tileData,tileDataNew)){
                this.setState({
                    tileData:tileDataNew
                })
            }
        }
        
        if(unit){
            unitTab.style.visibility = 'visible'
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
                unitHealth:unit.health
            }

            if(!_.isEqual(this.state.unitData,unitDataNew)){
                this.setState({
                    unitData:unitDataNew
                })
            }
        }else{
            unitTab.style.visibility = 'hidden';
        }
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

        if(this.props.unit){
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
                    <p>Tile Info</p>
                </div>

                <div id="Unit" className="tabcontent">
                    <h3>{this.state.unitData.unitName}</h3>
                    <h5>Owner: {this.state.unitData.unitOwner}</h5>
                    <p>Race: {this.state.unitData.unitRace}</p> 
                    <p>Health: {this.state.unitData.unitHealth}</p>
                    <p>Attack: {this.state.unitData.unitAttackMin} - {this.state.unitData.unitAttackMax}</p>
                    <p>Armor: {this.state.unitData.unitArmorMin} - {this.state.unitData.unitArmorMax}</p>
                </div>
            </div>
        );
    }
}
 
export default TileData;