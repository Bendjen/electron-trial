import React from "react";
import "./index.scss";
import { Alert, Icon, Button } from 'antd';
const { ipcRenderer } = require('electron');

class Home extends React.Component {
  constructor(props) {
    super(props);
    console.log(process)
    this.state = {
      list: [
        {
          title: '普通窗口',
          description: '在主进程中通过new BrowserWindow() API 建立一个窗口',
          icon: 'desktop',
          handleOpen: () => {
            this.openWindow({
              windowKey: 'default'
            })
          }
        },
        {
          title: '无框窗口',
          description: '隐藏窗口边框与控制按钮（最小化、全屏、关闭按钮）',
          icon: 'border',
          handleOpen: () => {
            this.openWindow({
              windowKey: 'noFrame',
              titleBarStyle: 'hidden',
              frame: false
            })
          }
        },
        {
          title: '透明窗口',
          description: '使窗口背景透明化',
          icon: 'eye',
          handleOpen: () => {
            this.openWindow({
              windowKey: 'transparent',
              transparent: true,
              frame: false
            })
          }
        },
        {
          title: '手动定制拖拽区域',
          description: '无边框窗口默认不可拖拽，可通过手动制定拖拽区域',
          icon: 'pushpin',
          handleOpen: () => {
            this.openWindow({
              windowKey: 'customizeDrag',
              transparent: true,
              frame: false
            })
          }
        },
      ]
    }
  }
  openWindow(config) {
    ipcRenderer.send('NEW-WINDOW', config)
  }
  render() {
    return (
      <div className='windowContainer'>
        {this.state.list.map((item) => (
          <div className='line' key={item.title} data-flex="cross:center">
            <Alert
              style={{ width: '100%' }}
              message={item.title}
              description={item.description}
              type="info"
              showIcon
              icon={(<Icon type={item.icon} />)}
            />
            <Button className='windowOpenButton' onClick={item.handleOpen.bind(this)}>打开窗口</Button>
          </div>
        ))}
      </div>
    )
  }
}

export default Home;
