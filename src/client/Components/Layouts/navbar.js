/* eslint-disable */
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
      <nav className="nav-wrapper grey darken-3">
            <div className="container">
                <ul className="left">
                    <li> <Link to='/' className='brand-logo'>RTS Reports</Link> </li>
                </ul>
                <ul className="right">
                    <li> <Link to='/'>Banner Report</Link> </li>
                    <li> <Link to='/StoreReport'>Store Report</Link> </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;