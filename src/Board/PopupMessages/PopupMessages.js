import React, { Component } from 'react';
import './PopupMessages.css'

class PopupMessages extends Component {

    constructor(){
        super()
        
    }

    componentDidUpdate(){
        //document.getElementById('popUpMessage').innerHTML = "This is a message"
    }

    state = {  }
    render() { 
        return (  
            <React.Fragment>
                <div id='popUpMessageBorder'>
                    <div id='popUpMessage'>Please Select a Capital Location</div>
                </div>
            </React.Fragment>
        );
    }
}
 
export default PopupMessages;