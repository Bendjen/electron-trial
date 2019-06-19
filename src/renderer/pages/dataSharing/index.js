import React from "react";
import "./index.scss";
import { Input, Button, Modal } from 'antd';
const { ipcRenderer, remote } = require('electron');

class DataSharing extends React.Component {
  constructor(props) {
    super(props);
    localStorage.setItem('mockValue', 'renderer value')
    this.state = {
      rendererValue: remote.getGlobal('mockValue'),
      mainValue: remote.getGlobal('mockValue'),
      storageValue: localStorage.getItem('mockValue'),
      editValue: '',
      target: '',
      visible: false
    }
  }
  componentDidMount() {
    ipcRenderer.on('GLOBAL-VALUE-CHANGE', (sys, message) => {
      this.setState({
        mainValue: remote.getGlobal('mockValue'),
        rendererValue: remote.getGlobal('mockValue')
      })
    })
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('GLOBAL-VALUE-CHANGE')
  }

  changeMainValue() {
    this.setState({ visible: true })
    ipcRenderer.send('CHANGE-VALUE', {
      key: 'mockValue',
      value: 123
    })
  }

  changeValue(target) {
    this.setState({ visible: true, target: target })
  }

  confirmChange() {
    if (this.state.target == 'main') {
      ipcRenderer.send('CHANGE-GLOBAL-VALUE', {
        key: 'mockValue',
        value: this.state.editValue
      })
      this.setState({ visible: false, editValue: '' })
    } else if (this.state.target == 'renderer') {
      ipcRenderer.send('CHANGE-GLOBAL-VALUE', {
        key: 'mockValue',
        value: this.state.editValue
      })
      this.setState({ rendererValue: this.state.editValue, visible: false, editValue: '', })
    } else if (this.state.target == 'storage') {
      localStorage.setItem('mockValue', this.state.editValue)
      this.setState({ storageValue: this.state.editValue, visible: false, editValue: '', })
    }
  }

  openOtherRenderer() {
    ipcRenderer.send('OPEN-STORAGE-WINDOW')
  }

  handleEditChange(e) {
    this.setState({
      editValue: e.target.value
    })
  }

  handleCancel() {
    this.setState({ visible: false, editValue: '' })
  }

  render() {
    const { rendererValue, mainValue, editValue, storageValue } = this.state
    return (
      <div className='dataSharingContainer'>
        <div className='line'>
          <h1># 渲染进程与主进程数据共享</h1>
          <p>渲染进程通过remote.getGlobal(name)获取主进程的data，通过ipcRenderer.send()向主进程请求变更data</p>
          <div className='content'>
            <p>
              <span>主进程的值：</span>
              <span>{mainValue}</span>
              <Button onClick={this.changeValue.bind(this, 'main')}>更改</Button>
            </p>
            <p>
              <span>渲染进程的值：</span>
              <span>{rendererValue}</span>
              <Button onClick={this.changeValue.bind(this, 'renderer')}>更改</Button>
            </p>
          </div>
        </div>
        <div className='line'>
          <h1># 渲染进程与渲染进程数据共享</h1>
          <p>使用浏览器自带的HTML5 API，如localStorage。(变更值后重新打开其他渲染进程查看)</p>
          <div className='content' >
            <p>
              <span>渲染进程的值：</span>
              <span>{storageValue}</span>
              <Button onClick={this.changeValue.bind(this, 'storage')}>更改</Button>
              <Button style={{ marginLeft: 20 }} onClick={this.openOtherRenderer}>查看其他渲染进程</Button>
            </p>
          </div>
        </div>
        <Modal
          title="更改"
          okText='更改'
          cancelText='取消'
          centered
          visible={this.state.visible}
          onOk={this.confirmChange.bind(this)}
          onCancel={this.handleCancel.bind(this)}
        >
          <Input value={editValue} onChange={this.handleEditChange.bind(this)} placeholder="请输入变更的值" />
        </Modal>
      </div>
    )
  }
}

export default DataSharing;
