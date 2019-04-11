import React, { Component } from 'react';
import './PlayerInfo.css';

class PlayerInfo extends Component {

    constructor(props){
        super(props)
        this.foodDemand = 0
        this.food = 0
        this.foodChange = 0
        this.gold = 0
        this.goldChange = 0
        this.wood = 0
        this.woodChange = 0
        this.metal = 0
        this.metalChange = 0
    }
    state = {  }
    render() { 
        return (
            <div id='playerInfo'>
                <p>Food Demand: {this.foodDemand}</p>
                <p>Food: {this.food} ({this.foodChange})</p>                
                <p>Gold: {this.gold} ({this.goldChange})</p>
                <p>Wood: {this.wood} ({this.woodChange})</p>
                <p>Metal: {this.metal} ({this.metalChange})</p> 
            </div>
        );
    }
}
 
export default PlayerInfo;