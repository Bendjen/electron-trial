// import 'react-hot-loader'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { message } from 'antd';
import { ipcRenderer } from 'electron'

ipcRenderer.on('message', (event, message) => {
  console.log(message)
})
ReactDOM.render(<App />, document.getElementById('root'));