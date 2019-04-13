import React, { Component } from 'react';
import './PlayerInfo.css';

import firebase from 'firebase'
import * as DB from '../../Firebase/Firestore/DB';

class PlayerInfo extends Component {

    constructor(props){
        super(props)
        this.db = firebase.firestore()
        this.resources = this.props.resources
    }
    state = {  
        resources:0,
        foodDemand: 0,
        foodChange: 0,
        goldChange: 0,
        woodChange: 0,
        metalChange: 0
    }

    componentDidUpdate(){
        if(this.props.resources){
            if(this.state.resources !== this.props.resources){
                this.setState({
                    resources:this.props.resources
                })
            }
        }
    }
    
    render() { 
        return (
            <div id='playerInfo'>
                <p>Food Demand: {this.state.foodDemand}</p>
                <p>Food: {this.state.resources.Food} ({this.state.foodChange})</p>                
                <p>Gold: {this.state.resources.Gold} ({this.state.goldChange})</p>
                <p>Wood: {this.state.resources.Wood} ({this.state.woodChange})</p>
                <p>Metal: {this.state.resources.Metal} ({this.state.metalChange})</p> 
            </div>
        );
    }
}
 
export default PlayerInfo;