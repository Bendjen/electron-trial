// import { hot } from 'react-hot-loader/root';
import React from 'react';
import './index.css';
import { Button, notification } from 'antd';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Body, Header, Menu } from "../layout/index";
import Home from "../pages/home"
import { CheckUpdate, CheckAvailable } from "../remote"
const { ipcRenderer, remote } = require('electron');


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      existNewVersion: false,
      downloading: false,
      available: false,
      progress: 0,
      newVersion: '',
      version: remote.getGlobal('version')
    }
  }
  componentDidMount() {
    this.downloadProgressListen()
    this.checkUpdate()
  }


  downloadProgressListen() {
    ipcRenderer.on('DOWNLOAD-PROGRESS', (sys, value) => {
      this.setState({
        progress: value,
        available: value >= 100 ? true : false
      })
      if (value >= 100) {
        this.emitUpdate()
      }
    })
  }

  emitInstall() {
    notification.close('updateNotification')
    notification.close('installNotification')
    this.setState({
      existNewVersion: false,
      downloading: false,
      available: false,
      newVersion: ''
    })
    notification.success({
      message: '更新提示',
      description:
        '更新成功，您的版本已经是最新版本。',
    });
  }

  // 执行更新
  emitUpdate() {
    const key = 'installNotification';
    const btnInstall = (
      <Button type="primary" key="update" style={{ marginRight: 20, marginTop: 10 }} onClick={this.emitInstall.bind(this)}>安装</Button>
    );
    const btnCancel = (
      <Button style={{ marginTop: 10 }} key="cancel" onClick={() => { notification.close('installNotification') }}>取消</Button>
    )
    notification.close('updateNotification')
    CheckAvailable().then(data => {
      if (data.available) {
        this.setState({ available: true, downloading: false })
        notification.open({
          message: '安装提示',
          duration: null,
          description:
            `新版本 ${data.version} 已准备就绪，是否要现在安装更新？`,
          btn: [btnInstall, btnCancel],
          key,
          onClose: () => { notification.close('updateNotification') },
        });
      } else if (data.downloading) {
        this.setState({ available: false, downloading: true })
      }
    }).catch(err => {
      this.setState({ available: false, downloading: false })
      notification.error({
        message: '安装提示',
        description:
          `请求安装失败，失败原因:${err}`,
      });
    })
  }

  // 检查更新
  checkUpdate() {
    const key = 'updateNotification';
    const btnUpdate = (
      <Button type="primary" key="update" style={{ marginRight: 20, marginTop: 10 }} onClick={this.emitUpdate.bind(this)}>更新</Button>
    );
    const btnCancel = (
      <Button style={{ marginTop: 10 }} key="cancel" onClick={() => { notification.close('updateNotification') }}>取消</Button>
    )
    CheckUpdate().then(data => {
      if (data.status == 1) {
        this.setState({
          existNewVersion: true,
          newVersion: data.version
        })
        notification.open({
          message: '更新提示',
          duration: null,
          description:
            `electron-trial 存在新版本 ${data.version}，是否要下载更新？`,
          btn: [btnUpdate, btnCancel],
          key,
          onClose: () => { notification.close('updateNotification') },
        });
      } else if (data.status == 0) {
        notification.success({
          message: '更新提示',
          description:
            '您的版本已经是最新版本。',
        });
      }
    }).catch(err => {
      notification.error({
        message: '更新提示',
        description:
          `请求更新失败，失败原因:${err}`,
      });
    })
  }
  render() {
    const { existNewVersion, downloading, available, newVersion, version, progress } = this.state
    const Main = () => (
      <Body>
        <Route exact={true} path="/" component={Home} />
      </Body>
    );
    return (
      <Router>
        <div className='rootConatiner'>
          <Header emitInstall={this.emitInstall.bind(this)} emitUpdate={this.emitUpdate.bind(this)} checkUpdate={this.checkUpdate.bind(this)}
            version={version} newVersion={newVersion} available={available} downloading={downloading} existNewVersion={existNewVersion} progress={progress} />
          <Menu />
          <Main />
        </div>
      </Router>
    );
  }
}

export default App;
