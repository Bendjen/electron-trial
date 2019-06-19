import React from "react";
import "./index.scss";
import { Input, Button, Modal } from 'antd';
const { ipcRenderer } = require('electron');

class Communication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderer2main: '这是一条由渲染进程向主进程发送的信息',
      main2renderer: '这是一条由主进程进程向渲染进程发送的信息',
      renderer2renderer: '这是一条由渲染进程向渲染进程发送的信息'
    }
  }
  componentDidMount() {
    ipcRenderer.on('MAIN-TO-RENDERER', (sys, message) => {
      Modal.info({
        title: '提示',
        content: message,
        centered: true
      })
    })
    ipcRenderer.on('RENDERER-TO-RENDERER', (sys, message) => {
      Modal.info({
        title: '提示',
        content: message,
        centered: true
      })
    })
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('MAIN-TO-RENDERER')
    ipcRenderer.removeAllListeners('RENDERER-TO-RENDERER')
  }


  handleChange(e, key) {
    this.setState({
      [key]: e.target.value
    })
  }
  handleSend(eventName, key) {
    ipcRenderer.send(eventName, this.state[key])
  }
  render() {
    const { renderer2main, main2renderer, renderer2renderer } = this.state
    return (
      <div className='communicationContainer'>
        <div className='line'>
          <h1># 渲染进程向主进程通信</h1>
          <p>在渲染进程使用ipcRenderer.send()进行发送后，在主进程使用ipcMain.on()进行监听。</p>
          <div className='sendBar' data-flex='cross:center'>
            <Input size='large' onChange={e => this.handleChange.bind(this, e, 'renderer2main')()} value={renderer2main} style={{ width: 360, marginRight: 60 }} placeholder="请输入要向主进程发送的信息" />
            <Button type="primary" onClick={this.handleSend.bind(this, 'RENDERER-TO-MAIN', 'renderer2main')}>发送</Button>
          </div>
        </div>
        <div className='line'>
          <h1># 主进程进程向渲染通信</h1>
          <p>在主进程使用mainWindow.webContents.send()进行发送后，在渲染进程使用ipcRenderer.on()进行监听。</p>
          <div className='sendBar' data-flex='cross:center'>
            <Input size='large' onChange={e => this.handleChange.bind(this, e, 'main2renderer')()} value={main2renderer} style={{ width: 360, marginRight: 60 }} placeholder="请输入要向渲染进程发送的信息" />
            <Button type="primary" onClick={this.handleSend.bind(this, 'MAIN-TO-RENDERER', 'main2renderer')}>发送</Button>
          </div>
        </div>
        <div className='line'>
          <h1># 渲染进程向渲染通信</h1>
          <p>在主进程建立中转站，然后向其他渲染进程转发。</p>
          <div className='sendBar' data-flex='cross:center'>
            <Input size='large' onChange={e => this.handleChange.bind(this, e, 'renderer2renderer')()} value={renderer2renderer} style={{ width: 360, marginRight: 60 }} placeholder="请输入要向渲染进程发送的信息" />
            <Button type="primary" onClick={this.handleSend.bind(this, 'RENDERER-TO-RENDERER', 'renderer2renderer')}>发送</Button>
          </div>
        </div>

      </div>
    )
  }
}

export default Communication;
