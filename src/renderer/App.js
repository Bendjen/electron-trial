// import { hot } from 'react-hot-loader/root';
import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from 'antd';
import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  handleClick() {
    axios.post('/api/test', { value: 1 }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Button type="primary" onClick={this.handleClick}>Primary</Button>
          <p>
            ssss <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
