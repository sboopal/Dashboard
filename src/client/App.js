/* eslint-disable*/
import React, { Component } from 'react';
import './app.css';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import NavbarPage from './Components/Layouts/navbar';
import BannerReport from './Components/Reports/BannerReport';
import 'materialize-css/dist/css/materialize.min.css';
import StoreReport from './Components/Reports/StoreReport';

class App extends Component {
  
  render() {
    return (
      <BrowserRouter>
        <div>
          <NavbarPage />
          <Switch>
            <Route exact path="/" render={() => ( <Redirect to="/StoreReport" /> )} />
            <Route path="/BannerReport" component={BannerReport} />
            <Route path="/StoreReport" component={StoreReport} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
