/* eslint-disable  */
import React, { Component } from 'react';
import 'materialize-css/dist/js/materialize.min.js'
import 'materialize-css/dist/css/materialize.min.css'
import M from "materialize-css";
import moment from 'moment';

// eslint-disable-next-line react/prefer-stateless-function
class StoreReport extends Component {
    state = {
        checked : 'one',
        data : [],
        store:'',
        terminal:'',
        account:'',
        amount:'',
        startDate:'',
        startTime:'',
        endDate:'',
        endTime:'',
        selected : {
            store : '',
            startDate:'',
            startTime:'',
            endDate:'',
            endTime:''
        }
    }

    componentDidMount() {
        //console.log(this.state.data);
        M.AutoInit();
        var context = this;
        var elems = document.querySelectorAll(".startDateset");
        M.Datepicker.init(elems, {
            onSelect: function(date) {
                let selected = context.state.selected;
                selected['startDate'] = (date instanceof Date) ? 'true': 'false';
                context.setState({ selected, startDate: moment(date).format('YYYY-MM-DD'),data:[] });
            },
            autoClose: true
        });
        var elems1 = document.querySelectorAll(".endDateset");
        M.Datepicker.init(elems1, {
            onSelect: function(date) {
                let selected = context.state.selected;
                selected['endDate'] = (date instanceof Date) ? 'true': 'false';
                context.setState({ selected, endDate: moment(date).format('YYYY-MM-DD'),data:[] });
            },
            autoClose: true
        });
    }

    handleOnSubmit = (e) => {
        e.preventDefault();
        console.log(this.state);
    }

    handleChange = (e) => {
        const { id, value } = e.target;
        let selected = this.state.selected;
        selected[id] = value.length > 0 ? 'true': 'false';
        if((e.target.id).includes('Time')){
            this.setState({selected, [id] : moment(value,'hh:mm A').format('HH:mm:ss') })
        }else{
            this.setState({selected, [id] : value })
        }
        this.setState({data:[]})
    }

    handleRadioButtonChange = (e) => {
        this.setState({ checked : e.target.id, data : [] });
    }

    render(){
        const {selected} = this.state;
        const divStyle = {
            borderBottom:"1px solid rgb(218, 137, 137)"
        };
        return(
            <div>
                <div className="container">
                    <div className="row">
                        <form className="col s12" id="storeReportForm" onSubmit={this.handleOnSubmit}>
                            {/* firstrow store and register */}
                            <div className="row">
                                <h6 className="col s12 m2" >Store</h6>
                                <div className="input-field col s12 m3">
                                    <input id="store" type="number" className="validate invalid" data-length="4" onChange={this.handleChange} />
                                    <label htmlFor="store">Store Number</label>
                                </div>
                                <h6 className="col s12 m2 offset-m1" >Terminal</h6>
                                <div className="input-field col s12 m3">
                                    <input id="terminal" type="number" className="validate" data-length="4" onChange={this.handleChange} />
                                    <label htmlFor="terminal">Terminal Number</label>
                                </div>
                            </div>
                            {/* second row account and amount */}
                            <div className="row">
                                <h6 className="col s12 m2" >Account Number</h6>
                                <div className="input-field col s12 m3">
                                    <input id="account" type="number" className="validate" data-length="4" onChange={this.handleChange} />
                                    <label htmlFor="account">Last 4</label>
                                </div>
                                <h6 className="col s12 m2 offset-m1" >Amount</h6>
                                <div className="input-field col s12 m3">
                                    <input id="amount" type="text" onChange={this.handleChange} />
                                    <label htmlFor="amount">Amount</label>
                                </div>
                            </div>
                            {/* third row start date */}
                            <div className="row">
                                <h6 className="col s12 m2">Start Date</h6>
                                <div className="input-field col s6 m3">
                                    <input id="startDate" type="text"
                                        style={selected.startDate ==='true' ? {} : divStyle }
                                        className="datepicker startDateset" />
                                </div>
                                <div className="input-field col s6 m3">
                                    <input id="startTime" type="text" 
                                        style={selected.startTime ==='true' ? {} : divStyle }
                                        className="timepicker" onSelect={this.handleChange} />
                                </div>
                            </div>
                            {/* fourth row end date */}
                            <div className="row">
                                <h6 className="col s12 m2">End Date</h6>
                                <div className="input-field col s6 m3">
                                    <input id="endDate" type="text" 
                                    style={selected.endDate ==='true' ? {} : divStyle }
                                        className="datepicker endDateset" />
                                </div>
                                <div className="input-field col s6 m3">
                                    <input id="endTime" type="text" 
                                        style={selected.endTime ==='true' ? {} : divStyle }
                                        className="timepicker" onSelect={this.handleChange} />
                                </div>
                            </div>
                            {/* fifth row radio button */}
                            <div className="row">
                                <h6 className="col s12 m2">Output Type</h6>
                                <p className="input-field col s4 m2" >
                                    <label>
                                        <input name="group1" id='one' checked={this.state.checked === 'one'}
                                            onChange={this.handleRadioButtonChange} 
                                            className='with-gap' type="radio" />
                                        <span>Count</span>
                                    </label>
                                </p>
                                <p className="input-field col s4 m2" >
                                    <label>
                                        <input name="group1" id='two' checked={this.state.checked === 'two'} 
                                            onChange={this.handleRadioButtonChange} 
                                            className='with-gap' type="radio" />
                                        <span>Details</span>
                                    </label>
                                </p>
                            </div>
                            <br />
                            <button className="btn waves-light right" >Submit
                                <i className="material-icons right">send</i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default StoreReport;
