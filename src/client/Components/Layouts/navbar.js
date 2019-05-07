/* eslint-disable */
import React, { Component } from 'react';
import { Link,NavLink } from 'react-router-dom';



class NavbarPage extends Component {

    componentDidMount(){
        console.log("test");
    }

    render(){
        return (
            <div>
                <div className="navbar-fixed">
                    <nav className="nav-wrapper cyan darken-2">
                        <div className="container">
                            <div className="row col s12 m6">
                                <ul className="left">
                                    <li> <Link to='/' className='brand-logo'>RTS Reports</Link> </li>
                                </ul>
                                <a href="#" data-target="sidemenu" className="sidenav-trigger"><i className="material-icons">menu</i></a>               
                                <ul className="mainnav right hide-on-med-and-down" id="mainmenu">
                                    <li> <NavLink to='/BannerReport' >Banner Report</NavLink> </li>
                                    <li> <NavLink to='/StoreReport' >Store Report</NavLink> </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
                <ul className="sidenav" id="sidemenu">
                                <li> <NavLink to='/BannerReport'>Banner Report</NavLink> </li>
                                <li> <NavLink to='/StoreReport'>Store Report</NavLink> </li>
                </ul>
            </div>
        );
    }
    
}

export default NavbarPage;