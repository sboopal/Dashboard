/* eslint-disable*/
import React, { Component } from 'react';
import 'materialize-css/dist/js/materialize.min.js'
import 'materialize-css/dist/css/materialize.min.css'
import M from "materialize-css";

const vendorNodes = [
    {
        id:1,  
        name: 'Bay', 
        nodeNames: ['TDMAR', 'HBCGCD','HSBCRD']
    },
    {
        id:2,
        name: 'Saks', 
        nodeNames: ['CAPEMV', 'CSMLNK','FEPTKM','HSBCRD','PTAHUE','SMTCLX','TOKENEX','VTPDCR']
    },
    {
        id:3,
        name: 'LT', 
        nodeNames: ['PTACRD', 'LNTGCD','HSBCRD','FEPTKM','SMTCLX','TOKENEX','VTPDCR','INCISO']
    }
]


class BannerReport extends Component {

    state = {
        selectedBanner : 'Saks',
        selectedStoreType:'',
        selectedVendor:'',
        selectedTranStatus:'',
        startDate:'',
        endDate:'',
        data:[]
    }

    componentDidMount() {
        console.log(M);
        M.AutoInit();
    }

    handleChangeBanner = (e) => {
        this.setState({ selectedBanner : e.target.value })
    }

    handleChangeVendor = () => {
        console.log('testing');
        $('select').material_select();
    }

    handleOnSubmit = (e) => {
        e.preventDefault();
        console.log('submit function');
        fetch('/api/getData')
        .then((res) => {
            return res.json();
        })
        .then((results) => {
            this.setState({ data: results.data });
        });
    }

    render(){
    
        const getVendor = () => {
            const nodes = vendorNodes.filter((vendorNode) => vendorNode.name === this.state.selectedBanner)[0];
            return(
                <select onChange={this.handleChangeVendor}>
                    {nodes.nodeNames.map(m => <option>{m}</option>)}
                </select>
            )
        }

        return(
            <div className="container">
                <div className="row">
                    <form className="col s12" onSubmit={this.handleOnSubmit}>
                        <div className="row">
                            <h6 className="col s12 m2">Banner</h6>
                            <div className="input-field col s12 m3">
                                <select 
                                    name="bannerDropDown"
                                    onChange={this.handleChangeBanner} >
                                        {vendorNodes.map((vendorNode) => <option key={vendorNode.id} value={vendorNode.name}>{vendorNode.name}</option> )}
                                </select>
                                <label>Banner</label>
                            </div>
                            <h6 className="col s12 m2 offset-m1">Store Type</h6>
                            <div className="input-field col s12 m3">
                                <select>
                                    <option value="" disabled selected>Select</option>
                                    <option value="Online">Saks.Com</option>
                                    <option value="Physical">Physical Store</option>
                                </select>
                                <label>Type</label>
                            </div>
                        </div>
                        <div className="row">
                            <h6 className="col s12 m2">Vendor</h6>
                            <div className="input-field col s12 m3">
                                {getVendor()}
                                <label>Vendor</label>
                            </div>
                            <h6 className="col s12 m2 offset-m1">Tran Status</h6>
                            <div className="input-field col s12 m3">
                                <select>
                                    <option value="" disabled selected>Select</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Declined">Declined</option>
                                    <option value="Timeout">Timeout</option>
                                    <option value="Onhold">Onhold</option>
                                </select>
                                <label>Status</label>
                            </div>
                        </div>
                        <div className="row">
                            <h6 className="col s12 m2">Start Date</h6>
                            <div className="input-field col s6 m3">
                                <input type="text" className="datepicker" />
                            </div>
                            <div className="input-field col s6 m3">
                                <input type="text" className="timepicker" />
                            </div>
                        </div>
                        <div className="row">
                            <h6 className="col s12 m2">End Date</h6>
                            <div className="input-field col s6 m3">
                                <input type="text" className="datepicker" />
                            </div>
                            <div className="input-field col s6 m3">
                                <input type="text" className="timepicker" />
                            </div>
                        </div>
                        <button className="btn waves-effect waves-light">Submit
                            <i className="material-icons right">send</i>
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default BannerReport;