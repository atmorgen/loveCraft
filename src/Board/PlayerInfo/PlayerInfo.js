import React, { Component } from 'react';
import './PlayerInfo.css';

class PlayerInfo extends Component {

    constructor(props){
        super(props)
    }
    state = {  
        foodDemand: 0,
        food: 0,
        foodChange: 0,
        gold: 0,
        goldChange: 0,
        wood: 0,
        woodChange: 0,
        metal: 0,
        metalChange: 0
    }


    
    render() { 
        return (
            <div id='playerInfo'>
                <p>Food Demand: {this.state.foodDemand}</p>
                <p>Food: {this.state.food} ({this.state.foodChange})</p>                
                <p>Gold: {this.state.gold} ({this.state.goldChange})</p>
                <p>Wood: {this.state.wood} ({this.state.woodChange})</p>
                <p>Metal: {this.state.metal} ({this.state.metalChange})</p> 
            </div>
        );
    }
}
 
export default PlayerInfo;