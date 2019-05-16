/* eslint-disable*/
import React, { Component } from 'react';
import 'materialize-css/dist/js/materialize.min.js'
import 'materialize-css/dist/css/materialize.min.css'
import M from "materialize-css";
import moment from 'moment';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import MessageModal from '../Layouts/Modal';
import $ from 'jquery';
import 'bootstrap';

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
            selectedTranStatus:'false',
            startDate:'false',
            startTime:'false',
            endDate:'false',
            endTime:'false',
        },
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
                let errors = context.state.errors;
                errors['startDate'] = (date instanceof Date) ? 'true': 'false';
                context.setState({ errors, startDate: moment(date).format('YYYY-MM-DD'),data:[] });
            },
            autoClose: true
        });
        var elems1 = document.querySelectorAll(".endDateset");
        M.Datepicker.init(elems1, {
            onSelect: function(date) {
                let errors = context.state.errors;
                errors['endDate'] = (date instanceof Date) ? 'true': 'false';
                context.setState({ errors, endDate: moment(date).format('YYYY-MM-DD'),data:[] });
            },
            autoClose: true
        });
    }
    componentDidUpdate() {
        if(this.state.data.length > 0){
            const element = document.getElementById('RTSTable');
            element.scrollIntoView({behavior: 'smooth'});
        }        
    }
    validateForm = (state) => {
        let valid = true;
        Object.values(state.errors).forEach(
          (val) => val === 'false' && (valid = false)
        );
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

    openModal = (header,content) => {
        let modalMessage = this.state.modalMessage;
        modalMessage['header'] = header;
        modalMessage['content'] = content;
        this.setState({data:[],modalMessage})
        const elem = document.getElementById('mymodal');
        const instance = M.Modal.init(elem, {dismissible: false});
        instance.open();
    }

    handleOnSubmit = (e) => {
        e.preventDefault();

        const sDate = this.state.startDate + " " + this.state.startTime;
        const eDate = this.state.endDate + " " + this.state.endTime;

        if(moment(sDate).isSameOrBefore(moment(eDate))){
            let URL = '/api/getCount';
            if(this.state.checked === 'two'){
                URL = '/api/getTranDetails';
            }
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
                this.setState({ data: results.data });
                if(this.state.data.length === 0)
                {
                    this.openModal('Warning','No data available for this inputs');
                }
            })
            .catch((error) => {
                this.openModal('Error','Unable to retreive the data.Please try again. If the issue persists please contact administrator');
                console.log('Error in connecting to the database' + error);
            });
        }else{
            this.openModal('Error','StartDate is after EndDate. Please verify the conditions!!')
        }       
    }

    handleRadioButtonChange = (e) => {
        this.setState({checked:e.target.id,data:[]});
    }
    
    

    render(){
        
        const {isDisabled} = this.validateForm(this.state);
        const {errors} = this.state;
        const divStyle = {
            borderBottom:"1px solid rgb(218, 137, 137)"
        };

        const getVendor = () => {
            const nodes = vendorNodes.filter((vendorNode) => vendorNode.name === this.state.selectedBanner)[0];
            return(
                <select id="selectedVendor" className={errors.selectedVendor === 'true' ? "browser-default":"error browser-default"} onChange={this.handleChange}>
                    <option value="" disabled selected>Select</option>
                    {nodes.nodeNames.map(m => <option value={m}>{m}</option>)}
                </select>
            )
        }
        const getStoreType = () => {
            const nodes = vendorNodes.filter((vendorNode) => vendorNode.name === this.state.selectedBanner)[0];
            return(
                <select id="selectedStoreType" className={errors.selectedStoreType === 'true' ? "browser-default":"error browser-default"} onChange={this.handleChange}>
                    <option value="" disabled selected>Select</option>
                    {nodes.storeType.map(m => <option value={m}>{m}</option>)}
                </select>
            )
        }
        const getTableData = () => {
            const { data } = this.state;
            const countTableColumns = [
                {
                    Header:"Tran Status",
                    accessor:"Transactionactioncode"
                },
                {
                    Header:"No of Transactions",
                    accessor:"TranCount"
                }
            ];
            const detailsTableColumn = [
                {
                    Header:"Store",
                    accessor:"Store"
                },
                {
                    Header:"Terminal",
                    accessor:"Terminal"
                },
                {
                    Header:"Tran Domain",
                    accessor:"TransactionDomain"
                },
                {
                    Header:"Tran Type",
                    accessor:"TransactionType"
                },
                {
                    Header:"AccountType",
                    accessor:"AccountType"
                },
                {
                    Header:"Amount",
                    accessor:"Amount"
                },
                {
                    Header:"Tran ActionCode",
                    accessor:"TransactionActionCode"
                },
                {
                    Header:"TransactionIsoResponse",
                    accessor:"TransactionIsoResponse"
                },
                {
                    Header:"AccountDisplay",
                    accessor:"AccountDisplay"
                },
                {
                    Header:"SourceLogDateTime",
                    accessor:"SourceLogDateTime"
                },
                {
                    Header:"Server",
                    accessor:"Server"
                },
                {
                    Header:"InvoiceNumber",
                    accessor:"InvoiceNumber"
                },
                {
                    Header:"AuthCode",
                    accessor:"AuthCode"
                }
            ]
            const pageSize = data.length < 10 ? data.length : 10;
            return(
                data.length > 0 ? (
                    <ReactTable 
                        data={data}
                        columns = {this.state.checked === 'one' ? countTableColumns : detailsTableColumn}
                        defaultPageSize={pageSize}
                        className='-striped -highlight -bordered' />
                ): (
                    null
                )
            ) 
        }
        return(
            <div>
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
                                        <option value="10">Timeout</option>
                                        <option value="2">Onhold</option>
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
                                    <input id="endDate" type="text" 
                                    style={errors.endDate ==='true' ? {} : divStyle }
                                        className="datepicker endDateset" />
                                </div>
                                <div className="input-field col s6 m3">
                                    <input id="endTime" type="text" 
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
                        {getTableData()}
                    </div>                    
                </div>
            </div>
        );
    }
}

export default BannerReport;