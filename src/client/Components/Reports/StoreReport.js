/* eslint-disable  */
import React, { Component } from 'react';
import 'materialize-css/dist/js/materialize.min.js'
import 'materialize-css/dist/css/materialize.min.css'
import M from "materialize-css";
import moment from 'moment';
import MessageModal from '../Layouts/Modal';

// eslint-disable-next-line react/prefer-stateless-function
class StoreReport extends Component {
    state = {
        checked : 'one',
        data : [],
        store:'',
        terminal:'',
        account:'',
        amount:'',
        start:'',
        startDate:'',
        startTime:'',
        endDate:'',
        endTime:'',
        selected : {
            store : '',
            amount:'',
            startDate:'',
            startTime:'',
            endDate:'',
            endTime:''
        },
        input:'',
        modalMessage : {
            header : '',
            content : ''
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
        const sDate = this.state.startDate + " " + this.state.startTime;
        const eDate = this.state.endDate + " " + this.state.endTime;
        if(moment(sDate).isBefore(moment(eDate))){
        }else{
            this.openModal('Error','StartDate is after EndDate. Please verify the conditions!!')
            let {selected} = this.state;
            const id = moment(this.state.startDate).isSame(moment(this.state.endDate)) ? 'startTime' : 'startDate';
            selected[id] = 'false';
            this.setState({selected});
        }
    }
    
    handleChange = (e) => {
        let { id, value, maxLength } = e.target;
        let selected = this.state.selected;
        selected[id] = value.length > 0 ? 'true': 'false';
        if((e.target.id).includes('Time')){
            this.setState({selected, [id] : moment(value,'hh:mm A').format('HH:mm:ss') })
        }else{
            if (value.length > maxLength) {
                value = value.slice(0, maxLength)
            }
            this.setState({selected, [id] : value })
        }
        this.setState({data:[]})
    }
    openModal = (header,content) => {
        let modalMessage = this.state.modalMessage;
        modalMessage['header'] = header;
        modalMessage['content'] = content;
        this.setState({data:[],modalMessage})
        const elem = document.getElementById('mymodal');
        const instance = M.Modal.init(elem, {dismissible: false});
        instance.open();
    }
    handleDecimalChange = (e) => {
        this.state.start = e.target.selectionStart;
        let val = e.target.value;
        let {selected} = this.state;
        val = val.replace(/([^0-9.]+)/, "");
        val = val.replace(/^(0|\.)/, "");
        const match = /(\d{0,7})[^.]*((?:\.\d{0,2})?)/g.exec(val);
        const value = match[1] + match[2];
        this.setState({ amount : value });
        if (val.length > 0) {
            selected['amount'] = 'true';
            let amount = Number(value).toFixed(2);
            this.setState({ selected, amount });
            console.log(this.state.amount);
            if( amount === '0.00' ){
                selected['amount'] = 'false';
                this.setState({ selected });
            }
        }
        else{
            selected['amount'] = 'false';
            this.setState({ selected });
        }
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
                                <h6 className="col s12 m2 required-field" >Store</h6>
                                <div className="input-field col s12 m3">
                                    <input id="store" type="number" className="validate" maxLength="4"
                                         value = {this.state.store}
                                         onChange={this.handleChange} />
                                    <label htmlFor="store">Store Number</label>
                                </div>
                                <h6 className="col s12 m2 offset-m1" >Terminal</h6>
                                <div className="input-field col s12 m3">
                                    <input id="terminal" type="number" className="validate" maxLength="4" 
                                        value = {this.state.terminal}
                                        onChange={this.handleChange} />
                                    <label htmlFor="terminal">Terminal Number</label>
                                </div>
                            </div>
                            {/* second row account and amount */}
                            <div className="row">
                                <h6 className="col s12 m2" >Account Number</h6>
                                <div className="input-field col s12 m3">
                                    <input id="account" type="number" className="validate" maxLength="4" 
                                        value={this.state.account}
                                        onChange={this.handleChange} />
                                    <label htmlFor="account">Last 4</label>
                                </div>
                                <h6 className="col s12 m2 offset-m1" >Amount</h6>
                                <div className="input-field col s12 m3">
                                    <input id="amount" type="text" 
                                        className = {selected.amount === 'true' ? 'valid' : ''}
                                        value = {this.state.amount}
                                        onChange={this.handleDecimalChange} />
                                    <label htmlFor="amount">Amount</label>
                                </div>
                            </div>
                            {/* third row start date */}
                            <div className="row">
                                <h6 className="col s12 m2 required-field">Start Date</h6>
                                <div className="input-field col s6 m3">
                                    <input id="startDate" type="text"
                                        className={`datepicker startDateset ${selected.startDate === 'true' ? "valid" : "invalid"}`} />
                                </div>
                                <div className="input-field col s6 m3">
                                    <input id="startTime" type="text" 
                                        className={`timepicker ${selected.startTime === 'true' ? "valid": "invalid" }`} 
                                        onSelect={this.handleChange} />
                                </div>
                            </div>
                            {/* fourth row end date */}
                            <div className="row">
                                <h6 className="col s12 m2 required-field">End Date</h6>
                                <div className="input-field col s6 m3">
                                    <input id="endDate" type="text" 
                                        className={`datepicker endDateset ${selected.endDate === 'true' ? "valid" : "invalid" }`} />
                                </div>
                                <div className="input-field col s6 m3">
                                    <input id="endTime" type="text" 
                                        className={`timepicker ${selected.endTime === 'true' ? "valid" : "invalid" }`} 
                                        onSelect={this.handleChange} />
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
                    <MessageModal message={this.state.modalMessage} />
                </div>
            </div>
        )
    }
}

export default StoreReport;
