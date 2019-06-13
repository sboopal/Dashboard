/* eslint-disable*/
import React from 'react';
import ReactTable from 'react-table';
import moment from 'moment';
import M from "materialize-css";
import MediaQuery from 'react-responsive'

const getColumnValues = (value) => {
    if(value === 0){
        return '0 - Approved';
    }else if(value === 1){
        return '1 - Declined';
    }else if(value === 2){
        return '2 - Offline';
    }else if(value === 10){
        return '10 - Timeout';
    }else{
        return value;
    }
}
const getColumnValuesForDate = (value) => {
    //const date =  moment(value).tz('UTC').format('YYYY-MM-DD HH:mm:ss');
    var localTime  = moment.utc(value).toDate();
    localTime = moment(localTime).add(5,'hours').format('YYYY-MM-DD HH:mm:ss');
    return localTime;
}

const getTableData = (data) => {
    let columns = [];
    if(data.length > 0){
        columns = Object.keys(data[0]).map(key => {
            if(key === 'TransactionActionCode'){
                return {
                    Header: 'Transaction Status',
                    accessor:key,
                    Cell : row => (
                        <span>
                            {
                                getColumnValues(row.value)
                            }
                        </span>
                    )
                }
            }else if(key == 'SourceLogDateTime'){
                return{
                    Header: key,
                    accessor:key,
                    Cell : row => (
                        <span>
                            {
                                getColumnValuesForDate(row.value)
                            }
                        </span>
                    )
                }
            }else{
                return {
                    Header: key,
                    accessor:key
                }
            }
        })
    }
    const pageSize = data.length < 10 ? data.length : 10;
    return(
        data.length > 0 ? (
            <ReactTable 
                data={data}
                columns = {columns}
                defaultPageSize={pageSize}
                className='-striped -highlight -bordered' />
        ): (
            null
        )
    ) 
}

const openModal = (header,content,component) => {
    let modalMessage = component.state.modalMessage;
    modalMessage['header'] = header;
    modalMessage['content'] = content;
    component.setState({data:[],modalMessage})
    const elem = document.getElementById('mymodal');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.open();
}

const setDates = (component,reportType) => {
    M.AutoInit();
        var context = component;
        var elems = document.querySelectorAll(".startDateset");
        var elems1 = document.querySelectorAll(".endDateset");
        M.Datepicker.init(elems, {
            onSelect: function(date) {
                if(reportType === 'banner'){
                    let errors = context.state.errors;	
                    errors['startDate'] = (date instanceof Date) ? 'true': 'false';
                }
                context.setState({ startDate: moment(date).format('YYYY-MM-DD'),data:[] });
                const startDate = moment(date).add(1,'days').format('YYYY-MM-DD');
                let endDate = moment(date).add(2,'days').format('YYYY-MM-DD');
                if(moment(endDate).isAfter(moment())){
                    endDate = moment().format('YYYY-MM-DD');
                }
                M.Datepicker.init(elems1, {
                    onSelect: function(date) {
                        if(reportType === 'banner'){
                            let errors = context.state.errors;	
                            errors['endDate'] = (date instanceof Date) ? 'true': 'false';
                        }
                        context.setState({ endDate: moment(date).format('YYYY-MM-DD'),data:[] });
                    },
                    minDate: new Date(startDate),
                    maxDate: new Date(endDate),
                    autoClose: true
                });
            },
            maxDate: new Date(),
            autoClose: true
        });
}

const dividers = () => {
    return (
        <div>
            <MediaQuery query = "(min-device-width: 600px)">
                <div className="col" style={{marginLeft:'10px',marginRight:'10px'}}>
                    <div className="row vertical-line"></div>
                    <div className="row" style={{paddingTop:'90px'}}> OR </div>
                    <div className="row vertical-line"></div>
                </div>
            </MediaQuery>
            <MediaQuery query = "(max-device-width: 599px)">
                <div className="col s12" style={{marginTop:'5px',marginBottom:'5px'}}>
                    <div className="col s4 horizontal-line" style = {{paddingTop:'10px'}}></div>
                    <div className="col s4 offset-s5"> OR </div>
                    <div className="col s4 offset-s6 horizontal-line" style = {{paddingTop:'10px'}}></div>
                </div>
            </MediaQuery>
        </div>
    )
}

export {getTableData,openModal,setDates,dividers};