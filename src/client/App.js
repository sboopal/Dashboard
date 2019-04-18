import React, { Component } from 'react';
import './app.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from './Components/Layouts/navbar';
import BannerReport from './Components/Reports/BannerReport';
import 'materialize-css/dist/css/materialize.min.css';

class App extends Component {
  state = { username: null };

  componentDidMount() {
    fetch('/api/getData')
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((user) => {
        console.log(user);
        this.setState({ username: user.username });
      });
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Navbar />
          <Switch>
            <Route exact path="/" component={BannerReport} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
