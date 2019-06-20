// import { hot } from 'react-hot-loader/root';
import React from 'react';
import './index.css';
import { HashRouter as Router, Route } from "react-router-dom";
import { Body, Header, Menu } from "../layout/index";


import Home from "../pages/home"
import Window from "../pages/window"
import Dialog from "../pages/dialog"
import DataSharing from "../pages/dataSharing"
import Communication from "../pages/communication"
import Printer from "../pages/printer"
import Other from "../pages/other"


class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const Main = () => (
      <Body>
        <Route exact={true} path="/" component={Home} />
        <Route exact={true} path="/home" component={Home} />
        <Route exact={true} path="/window" component={Window} />
        <Route exact={true} path="/dialog" component={Dialog} />
        <Route exact={true} path="/communication" component={Communication} />
        <Route exact={true} path="/dataSharing" component={DataSharing} />
        <Route exact={true} path="/printer" component={Printer} />
        <Route exact={true} path="/other" component={Other} />
      </Body>
    );
    return (
      <Router>
        <div className='rootConatiner'>
          <Header />
          <Menu />
          <Main />
        </div>
      </Router>
    );
  }
}

export default App;
