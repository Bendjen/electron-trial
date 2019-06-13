// import 'react-hot-loader'
import React from 'react';
import ReactDOM from 'react-dom';
import 'flex.css/dist/data-flex.css'
import App from './app';
import './index.css';

import { ipcRenderer } from 'electron'



ipcRenderer.on('message', (event, message) => {
  console.log(message)
})
ReactDOM.render(<App />, document.getElementById('root'));