/* eslint-disable  */
import React, { Component } from 'react';
import 'materialize-css/dist/js/materialize.min.js'
import 'materialize-css/dist/css/materialize.min.css'
import M from "materialize-css";

const display = {
    display: 'block'
};
const hide = {
    display: 'none'
};

// eslint-disable-next-line react/prefer-stateless-function
class StoreReport extends Component {
    state = {
        toggle : 'true'
    }

    componentDidMount() {
        //console.log(this.state.data);
        M.AutoInit();
    }
    render(){
        
        return(
            <div>
                
            </div>
        )
    }
}

export default StoreReport;
