/* eslint-disable*/
import React, { Component } from 'react';
import 'materialize-css/dist/js/materialize.min.js';
import 'materialize-css/dist/css/materialize.min.css';
import moment from 'moment';
import 'react-table/react-table.css';
import MessageModal from '../Layouts/Modal';
import 'bootstrap';
import LoadingScreen from 'react-loading-screen';
import { getTableData, openModal, setDates} from '../Globalfunctions/globalFunctions';

const vendorNodes = [
    {
        id:1,  
        name: 'Bay', 
        nodeNames: ['TDMAR', 'HBCGCD','HSBCRD'],
        storeType:['Online']
    },
    {
        id:2,
        name: 'Saks', 
        nodeNames: ['CAPEMV', 'CSMLNK','FEPTKM','HSBCRD','PTAHUE','SMTCLX','TOKNEX','VTPDCR'],
        storeType:['Physical']
    },
    {
        id:3,
        name: 'LT', 
        nodeNames: ['PTACRD', 'LNTGCD','HSBCRD','FEPTKM','SMTCLX','TOKNEX','VTPDCR','INCISO'],
        storeType:['Online','Physical']
    }
]

class BannerReport extends Component {

    state = {
        selectedBanner : 'Bay',
        selectedStoreType:'',
        selectedVendor:'',
        selectedTranStatus:'',
        startDate:'',
        startTime:'',
        endDate:'',
        endTime:'',
        outputType:'',
        data:[],
        checked:'one',
        errors: {
            selectedBanner : 'false',
            selectedStoreType:'false',
            selectedVendor:'false',
            selectedTranStatus:'true',
            startDate:'false',
            startTime:'false',
            endDate:'false',
            endTime:'false',
        },
        modalMessage : {
            header : '',
            content : ''
        },
        loadingScreen : false
    }
  
    componentDidMount() {
        setDates(this,'banner');
    }
    componentDidUpdate() {
        if(this.state.data.length > 0){
            const element = document.getElementById('RTSTable');
            element.scrollIntoView({behavior: 'smooth'});
        }        
    }
    validateForm = (state) => {
        let valid = true;
        const errors = state.errors;
        // Object.values(state.errors).forEach(
        //   (val) => val === 'false' && (valid = false)
        // );
        Object.keys(errors).forEach(
            (key) => {
                if(key === 'selectedTranStatus' && state.checked === 'two' && errors[key] === 'false'){
                    valid = false;
                }
                else if(key !== 'selectedTranStatus' && errors[key] === 'false' ){
                     valid = false
                }
            }
        )
        return {isDisabled : valid};
    }

    handleChange = (e) => {
        const { id, value } = e.target;
        let errors = this.state.errors;
        errors[id] = value.length > 0 ? 'true': 'false';
        if((e.target.id).includes('Time')){
            this.setState({errors, [id] : moment(value,'hh:mm A').format('HH:mm:ss') })
        }else{
            this.setState({errors, [id] : value })
        }
        this.setState({data:[]})
    }

    handleOnSubmit = (e) => {
        e.preventDefault();

        const sDate = this.state.startDate + " " + this.state.startTime;
        const eDate = this.state.endDate + " " + this.state.endTime;
        var Config = require('Config');
        let URL = Config.serverUrl;
        if(moment(sDate).isSameOrBefore(moment(eDate))){
            this.setState({loadingScreen : true});
            URL = this.state.checked === 'one' ? URL + '/getCount' : URL + '/getTranDetails';
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
                }
                res.json().then((error) => {
                    throw Error(error);
                });
            })
            .then((results) => {
                this.setState({ data: results.data,loadingScreen : false });
                if(this.state.data.length === 0)
                {
                    openModal('Warning','No data available for this inputs',this);
                }
            })
            .catch((error) => {
                this.setState({loadingScreen : false});
                openModal('Error','Unable to retreive the data.Please try again. If the issue persists please contact administrator',this);
                console.log('Error in connecting to the database' + error);
            });
        }else{
            openModal('Error','StartDate is after EndDate. Please verify the conditions!!',this)
        }       
    }

    handleRadioButtonChange = (e) => {
        this.setState({checked:e.target.id,data:[]});
        this.setState(prevState => {
            return {errors: {...prevState.errors, selectedTranStatus : 'false'}};
        });
    }
    
    

    render(){
        
        const {isDisabled} = this.validateForm(this.state);
        const {errors,startDate} = this.state;
        let isEndDateDisabled = true;
        if(startDate){
            isEndDateDisabled = false;
        }
        const divStyle = {
            borderBottom:"1px solid rgb(218, 137, 137)"
        };

        const getVendor = () => {
            const nodes = vendorNodes.filter((vendorNode) => vendorNode.name === this.state.selectedBanner)[0];
            return(
                <select id="selectedVendor" className={errors.selectedVendor === 'true' ? "browser-default":"error browser-default"} onChange={this.handleChange}>
                    <option value="" disabled selected>Select</option>
                    {nodes.nodeNames.map(m => <option value={m} key={m}>{m}</option>)}
                </select>
            )
        }
        const getStoreType = () => {
            const nodes = vendorNodes.filter((vendorNode) => vendorNode.name === this.state.selectedBanner)[0];
            return(
                <select id="selectedStoreType" className={errors.selectedStoreType === 'true' ? "browser-default":"error browser-default"} onChange={this.handleChange}>
                    <option value="" disabled selected>Select</option>
                    {nodes.storeType.map(m => <option value={m} key={m}>{m}</option>)}
                </select>
            )
        }
        
        return(
            <div>
            <LoadingScreen
                    loading = {this.state.loadingScreen}
                    bgColor='#f1f1f1bf'
                    spinnerColor='#9ee5f8'
                    textColor='#676767'
                    text='Loading... Please wait' />
                <div className="container">
                    <div className="row">
                        <form className="col s12" onSubmit={this.handleOnSubmit}>
                            <div className="row">
                                <h6 className="col s12 m2">Banner</h6>
                                <div className="input-field col s12 m3">
                                    <select 
                                        name="bannerDropDown"
                                        id="selectedBanner"
                                        className={errors.selectedBanner === 'true' ? "browser-default":"error browser-default"}
                                        onChange={this.handleChange} >
                                            <option value="" disabled selected>Select</option>
                                            {vendorNodes.map((vendorNode) => <option key={vendorNode.id} >{vendorNode.name}</option> )}
                                    </select>
                                    {/* <label>Banner</label> */}
                                </div>
                                <h6 className="col s12 m2 offset-m1">Store Type</h6>
                                <div className="input-field col s12 m3">
                                    {getStoreType()}
                                </div>
                            </div>
                            <div className="row">
                                <h6 className="col s12 m2">Vendor</h6>
                                <div className="input-field col s12 m3">
                                    {getVendor()}
                                </div>
                                <h6 className="col s12 m2 offset-m1">Tran Status</h6>
                                <div className="input-field col s12 m3">
                                    <select id="selectedTranStatus" 
                                        className={errors.selectedTranStatus === 'true' ? "browser-default":"error browser-default"} 
                                        onChange={this.handleChange}>
                                        <option value="" disabled selected>Select</option>
                                        <option value="0">Approved</option>
                                        <option value="1">Declined</option>
                                        <option value="2">Offline</option>
                                        <option value="10">Timeout</option>
                                        <option value="11">Other</option>
                                    </select>
                                    {/* <label>Status</label> */}
                                </div>
                            </div>
                            <div className="row">
                                <h6 className="col s12 m2">Start Date</h6>
                                <div className="input-field col s6 m3">
                                    <input id="startDate" type="text"
                                        style={errors.startDate ==='true' ? {} : divStyle }
                                        className="datepicker startDateset" />
                                </div>
                                <div className="input-field col s6 m3">
                                    <input id="startTime" type="text" 
                                        style={errors.startTime ==='true' ? {} : divStyle }
                                        className="timepicker" onSelect={this.handleChange} />
                                </div>
                            </div>
                            <div className="row">
                                <h6 className="col s12 m2">End Date</h6>
                                <div className="input-field col s6 m3">
                                    <input id="endDate" type="text" disabled={isEndDateDisabled}
                                    style={errors.endDate ==='true' ? {} : divStyle }
                                        className="datepicker endDateset" />
                                </div>
                                <div className="input-field col s6 m3">
                                    <input id="endTime" type="text" disabled={isEndDateDisabled}
                                        style={errors.endTime ==='true' ? {} : divStyle }
                                        className="timepicker" onSelect={this.handleChange} />
                                </div>
                            </div>
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
                            <button className="btn waves-light right" disabled={!isDisabled} >Submit
                                <i className="material-icons right">send</i>
                            </button>
                        </form>
                    </div>
                    <MessageModal message={this.state.modalMessage} />
                    <br />
                    <div id="RTSTable">
                        {getTableData(this.state.data)}
                    </div>                    
                </div>
            </div>
        );
    }
}

export default BannerReport;