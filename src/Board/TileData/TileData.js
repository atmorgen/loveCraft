import React, { Component } from 'react';
import './TileData.css'

class TileData extends Component {
    constructor(props){
        super(props)
    }
    state = { 
        tileName:null,
        x:null,
        y:null
    }

    componentDidMount(){
        this.mouseEvents()
    }

    componentDidUpdate(){
        this.renderTileData()
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
        if(tileBox.style.visibility == '' || tileBox.style.visibility == 'hidden') tileBox.style.visibility = 'visible'
    }

    closeBox(){
        var tileBox = document.getElementById('tileDataBox')
        tileBox.style.visibility = 'hidden' 
    }

    renderTileData(){
        var tile = this.props.tile
            if(tile){
                var classType = tile.classType
                if(this.state.tileName!==classType) this.setState({tileName:classType})
                if(this.state.x!== tile.getPosition().x) this.setState({x:tile.getPosition().x})
                if(this.state.y!==tile.getPosition().y) this.setState({y:tile.getPosition().y})
            }
    }

    render() { 
        return (  
            <div id='tileDataBox'>{this.state.tileName}  ({this.state.x},{this.state.y})
                <div onClick={this.closeBox} id='clsBtn'>&times;</div>
            </div>
        );
    }
}
 
export default TileData;