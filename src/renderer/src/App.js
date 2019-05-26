import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from 'antd';
// renderer进程可以不使用electron-connect用自带的热更新
// require('electron-connect').client.create()

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Button type="primary">Primary</Button>
        <p>
          Edittttss <code>src/App.js</code> and save to reload.
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

export default App;
