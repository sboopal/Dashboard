/* eslint-disable  */
import React, { Component } from 'react';
import 'materialize-css/dist/js/materialize.min.js'
import 'materialize-css/dist/css/materialize.min.css'
import moment from 'moment';
import MessageModal from '../Layouts/Modal';
import LoadingScreen from 'react-loading-screen';
import {getTableData,openModal,setDates,dividers} from '../Globalfunctions/globalFunctions';

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
        invoice:'',
        selected : {
            store : '',
            terminal:'',
            account:'',
            amount:'',
            startDate:'',
            startTime:'',
            endDate:'',
            endTime:'',
            invoice:''
        },
        modalMessage : {
            header : '',
            content : ''
        },
        loadingScreen : false
    }

    componentDidMount() {
        setDates(this,'store');
    }
    componentDidUpdate() {
        if(this.state.data.length > 0){
            const element = document.getElementById('RTSTable');
            element.scrollIntoView({behavior: 'smooth'});
        }        
    }
    handleOnSubmit = (e) => {
        e.preventDefault();
        const sDate = this.state.startDate + " " + this.state.startTime;
        const eDate = this.state.endDate + " " + this.state.endTime;
        const valid = this.validateForm(this.state);
        var Config = require('Config');
        let URL = Config.serverUrl;
        if(valid){
            if(moment(sDate).isSameOrBefore(moment(eDate))){
                URL = this.state.checked === 'one' ? URL + '/getStoreCount' : URL + '/getStoreTranDetails'
                this.setState({loadingScreen : true});
                fetch(URL,{
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(this.state)
                })
                .then((res) => {
                    if(res.ok){
                        return res.json();
                    }else{
                        throw res.status;
                    }
                })
                .then((results) => {
                    if(typeof results.data ==='undefined')
                    {
                        this.setState({loadingScreen : false});
                        openModal('Error','Unable to retrieve data from database. Please contact system admin',this);
                        window.scrollTo(0, 0)
                    }else if(results.data.length === 0) {
                        this.setState({loadingScreen : false});
                        openModal('Error','No data available for this input',this);
                        window.scrollTo(0, 0)
                    }
                    else{
                        this.setState({ data: results.data,loadingScreen:false });
                    }
                })
                .catch((error) => {
                    this.setState({loadingScreen : false});
                    openModal('Error','Unable to retreive the data.Please try again. If the issue persists please contact administrator',this);
                    console.log('Error in connecting to the database' + error);
                    window.scrollTo(0, 0)
                });
            }else{
                openModal('Error','StartDate is after EndDate. Please verify the conditions!!',this)
                let {selected} = this.state;
                const id = moment(this.state.startDate).isSame(moment(this.state.endDate)) ? 'startTime' : 'startDate';
                selected[id] = 'invalid';
                this.setState({selected});
            }
        }else{
            openModal('Error','Mandatory fields are not entered. Please check and try again',this);
            window.scrollTo(0, 0)
        }
    }

    validateForm = (state) => {
        let valid = true;
        const { store,startDate,startTime,endDate,endTime,selected,invoice } = state;
        const errors = { 
            store : store,
            startDate : startDate,
            startTime : startTime,
            endDate : endDate,
            endTime : endTime,
            invoice : invoice
        };
        Object.keys(errors).forEach(
          (key) => {
              if(key === 'store' && errors[key] === ''){
                if(invoice === ''){
                    selected['store'] = 'invalid';
                    selected['invoice'] = 'invalid';
                }
              }else if(errors[key] === '' && key !== 'invoice'){
                  selected[key] = 'invalid'
                  valid = false;
                }
          }
        );
        this.setState({ selected });
        console.log(this.state);
        return valid;
    }
    
    handleChange = (e) => {
        let { id, value, maxLength } = e.target;
        if((e.target.id).includes('Time')){
            this.setState({ [id] : moment(value,'hh:mm A').format('HH:mm:ss') })
        }else{
            if(value === "" || Math.sign(value) === 1 ){
                let {selected} = this.state;
                selected[id] = value.length > 0 ? 'valid' : '';
                if (id !== 'invoice' && value.length > maxLength) {
                    value = value.slice(0, maxLength)
                }
                if(id === 'store' || id === 'terminal' || id === 'account' || id === 'amount'){
                    if(id === 'store'){
                        selected['invoice'] = '';
                    }
                    this.setState({invoice : ''})
                }
                if(id === 'invoice'){
                    selected['store'] = '';
                    selected['terminal'] = '';
                    selected['account'] = '';
                    selected['amount'] = '';
                    value = value.replace(/^0+/,'');
                    this.setState({store:'',terminal:'',account:'',amount:''});
                }
                this.setState({ [id] : value, selected })
            }
        }
        this.setState({data:[]})
    }

    handleKeyPress = (e) => {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) { 
            e.preventDefault();
            return false;
        }
    }

    handleDecimalChange = (e) => {
        const start = e.target.selectionStart;
        let val = e.target.value;
        val = val.replace(/([^0-9.]+)/, "");
        val = val.replace(/^(0|\.)/, "");
        const match = /(\d{0,7})[^.]*((?:\.\d{0,2})?)/g.exec(val);
        const value = match[1] + match[2];
        this.setState({ amount : value });
        e.target.value = value;
        let {selected} = this.state;
        if (val.length > 0) {
            let amount = Number(value).toFixed(2);
            e.target.value = amount;
            e.target.setSelectionRange(start, start);
            this.setState({ amount });
            selected.amount = 'valid';
            if( amount === '0.00' ){
                selected.amount = '';
            }
        }
        else{
            selected.amount = ''
        }
        this.setState({selected,data:[]});
    }

    handleRadioButtonChange = (e) => {
        this.setState({ checked : e.target.id, data : [] });
    }

    render(){
        const {selected,startDate} = this.state;
        let isEndDateDisabled = true;
        if(startDate){
            isEndDateDisabled = false;
        }
        return(
            <div>
                <LoadingScreen
                    loading = {this.state.loadingScreen}
                    bgColor='#f1f1f1bf'
                    spinnerColor='#9ee5f8'
                    textColor='#676767'
                    text='Loading... Please wait'
                ></LoadingScreen>
                <div className="container">
                    <div className="row">
                        <form className="col s12" id="storeReportForm" onSubmit={this.handleOnSubmit}>
                            {/* first row */}
                            <div className="row" id='firstRow'>
                                <div className="col s12 m6 firstrowborder">
                                    {/* firstrow store and register */}
                                    <div className="row">
                                        <h6 className="col s12 m2 required-field" >Store</h6>
                                        <div className="input-field col s12 m3">
                                            <input id="store" type="number" className={`${selected.store}`} maxLength="4"
                                                value = {this.state.store}
                                                onChange={this.handleChange}
                                                onKeyPress={this.handleKeyPress} />
                                            <label htmlFor="store">Store</label>
                                        </div>
                                        <h6 className="col s12 m2 offset-m1" >Terminal</h6>
                                        <div className="input-field col s12 m3">
                                            <input id="terminal" type="number" className={selected.terminal} maxLength="4" 
                                                value = {this.state.terminal}
                                                onChange={this.handleChange}
                                                onKeyPress={this.handleKeyPress} />
                                            <label htmlFor="terminal">Term</label>
                                        </div>
                                    </div>
                                    {/* second row account and amount */}
                                    <div className="row">
                                    <h6 className="col s12 m2" >Account</h6>
                                    <div className="input-field col s12 m3">
                                        <input id="account" type="number" className={selected.account} maxLength="4" 
                                            value={this.state.account}
                                            onChange={this.handleChange}
                                            onKeyPress={this.handleKeyPress} />
                                        <label htmlFor="account">Last 4</label>
                                    </div>
                                    <h6 className="col s12 m2 offset-m1" >Amount</h6>
                                    <div className="input-field col s12 m3">
                                        <input id="amount" type="text" 
                                            className = {selected.amount}
                                            value = {this.state.amount}
                                            onChange={this.handleDecimalChange}
                                            onKeyPress={this.handleKeyPress} />
                                        <label htmlFor="amount">Amount</label>
                                    </div>
                                </div>
                                </div>
                                {/* vertical divider */}
                                {dividers()}
                                <div className="col s12 m5 firstrowborder">
                                    <div className="row">
                                        <h6 className="col s12 m4 required-field" >Invoice</h6>
                                        <div className="input-field col s12 m6">
                                            <input id="invoice" type="number" className={`${selected.invoice}`} maxLength="4"
                                                value = {this.state.invoice}
                                                onChange={this.handleChange}
                                                onKeyPress={this.handleKeyPress} />
                                            <label htmlFor="invoice">Invoice</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* third row start date */}
                            <div className="row">
                                <h6 className="col s12 m2 required-field">Start Date</h6>
                                <div className="input-field col s6 m3">
                                    <input id="startDate" type="text"
                                        className={`datepicker startDateset validate ${selected.startDate}`} />
                                    <label htmlFor="startDate">Date</label>
                                </div>
                                <div className="input-field col s6 m3">
                                    <input id="startTime" type="text" 
                                        className={`timepicker validate ${selected.startTime}`}
                                        onSelect={this.handleChange} />
                                    <label htmlFor="startTime">Time</label> 
                                </div>
                            </div>
                            {/* fourth row end date */}
                            <div className="row">
                                <h6 className="col s12 m2 required-field">End Date</h6>
                                <div className="input-field col s6 m3">
                                    <input id="endDate" type="text" disabled={isEndDateDisabled}
                                        className={`datepicker endDateset validate ${selected.endDate}`} />
                                    <label htmlFor="endDate">Date</label>
                                </div>
                                <div className="input-field col s6 m3">
                                    <input id="endTime" type="text" disabled={isEndDateDisabled}
                                        className={`timepicker validate ${selected.endTime}`} 
                                        onSelect={this.handleChange} />
                                    <label htmlFor="endTime">Time</label> 
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
                    <br />
                    <br />
                    <div id="RTSTable">
                        {getTableData(this.state.data)}
                    </div>
                </div>
            </div>
        )
    }
}

export default StoreReport;
