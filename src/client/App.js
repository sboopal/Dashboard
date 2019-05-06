/* eslint-disable*/
import React, { Component } from 'react';
import './app.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from './Components/Layouts/navbar';
import BannerReport from './Components/Reports/BannerReport';
import 'materialize-css/dist/css/materialize.min.css';
import StoreReport from './Components/Reports/StoreReport';

class App extends Component {
  
  render() {
    return (
      <BrowserRouter>
        <div>
          <Navbar />
          <Switch>
            <Route exact path="/" component={BannerReport} />
            <Route path="/StoreReport" component={StoreReport} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
