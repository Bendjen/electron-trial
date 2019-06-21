import React from "react";
import { Link } from "react-router-dom";
import { Menu, Dropdown, Icon, Progress, Button, Modal, notification } from 'antd';
import "./index.scss";
import { CheckUpdate, EmitDownload, EmitInstall } from "../../api"
const { ipcRenderer, remote } = require('electron');

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
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
  }


  downloadProgressListen() {
    ipcRenderer.on('DOWNLOAD-PROGRESS', (sys, progressInfo) => {
      console.log(progressInfo)
      this.setState({
        progress: progressInfo.percent,
        available: progressInfo.percent >= 100 ? true : false
      })
      if (value >= 100) {
        this.emitInstall()
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
    EmitInstall()
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
    this.setState({ available: false, downloading: true })
    notification.close('updateNotification')
    EmitDownload().then(info => {
      this.setState({ available: true, downloading: false })
      notification.open({
        message: '安装提示',
        duration: null,
        description:
          `新版本 ${info.version} 已准备就绪，是否要现在安装更新？`,
        btn: [btnInstall, btnCancel],
        key,
        onClose: () => { notification.close('updateNotification') },
      });
    }).catch(err => {
      this.setState({ available: false, downloading: false })
      notification.error({
        message: '安装提示',
        description: err,
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
      console.log(data)
      if (data.avaliable == true) {
        this.setState({
          existNewVersion: true,
          newVersion: data.info.version
        })
        notification.open({
          message: '更新提示',
          duration: null,
          description:
            `electron-trial 存在新版本 ${data.info.version}，是否要下载更新？`,
          btn: [btnUpdate, btnCancel],
          key,
          onClose: () => { notification.close('updateNotification') },
        });
      } else if (data.avaliable == false) {
        notification.success({
          message: '更新提示',
          description:
            '您的版本已经是最新版本。',
        });
      }
    }).catch(err => {
      notification.error({
        message: '更新提示',
        description: err,
      });
    })
  }

  render() {
    const { existNewVersion, downloading, available, newVersion, version, progress } = this.state
    const moreMenu = (
      <Menu>
        <Menu.Item key="about" onClick={() => this.setState({ modal: true })}>关于</Menu.Item>
        <Menu.Item key="update" onClick={this.checkUpdate.bind(this)}>检查更新</Menu.Item>
      </Menu>
    );
    const progressMenu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="downloading">
          正在下载新版本中，请稍候
        </Menu.Item>
        <Menu.Item key="progress">
          <Progress percent={progress} style={{ width: 200 }} status="active" />
        </Menu.Item>
      </Menu>
    );
    const existMenu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="exist">
          <div data-flex='cross:center'>
            <span data-flex='cross:center'> 存在新版本 <span style={{ color: '#1890FF' }}>{newVersion}</span> ，是否要更新？</span>
            <Button type="primary" style={{ marginLeft: 15 }} size='small' onClick={this.emitUpdate.bind(this)}>更新</Button>
          </div>
        </Menu.Item>
      </Menu>
    )
    const installMenu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="install">
          <div data-flex='cross:center'>
            <span data-flex='cross:center'> 新版本 <span style={{ color: '#1890FF' }}>{newVersion}</span> 已准备就绪，是否要安装？</span>
            <Button type="primary" style={{ marginLeft: 15 }} size='small' onClick={this.emitInstall.bind(this)}>安装</Button>
          </div>
        </Menu.Item>
      </Menu>
    )

    return (
      <div>
        <header className='header' data-flex="main start cross:center">
          <div className='container' data-flex="main:justify cross:center">
            <div data-flex="cross:center">
              <Link
                data-flex="cross:center"
                className='icon'
                to="/"
              >
                <i className="iconfont icon-kafeidou" />
                <span className='logo'>Bendjen</span>
              </Link>
            </div>
            <div>
              {(existNewVersion && !downloading && !available) ? (
                <Dropdown
                  overlay={existMenu}
                >
                  <Icon type="bulb" className='menuIcon menuIconExist' />
                </Dropdown>
              ) : null}
              {downloading ? (
                <Dropdown
                  overlay={progressMenu}
                >
                  <Icon type="sync" spin className='menuIcon menuIconDownloading' />
                </Dropdown>
              ) : null}
              {available ? (
                <Dropdown
                  overlay={installMenu}
                >
                  <Icon type="issues-close" className='menuIcon menuIconAvailable' />
                </Dropdown>
              ) : null}
              <Dropdown
                overlay={moreMenu}
              >
                <Icon type="menu" className='menuIcon' />
              </Dropdown>
            </div>

          </div>
        </header>
        <Modal
          centered
          title="关于"
          footer={null}
          onCancel={() => { this.setState({ modal: false }) }}
          visible={this.state.modal}
        >
          <div className='headerModal' data-flex='dir:top main:center cross:center'>
            <div data-flex='main:center corss:center'>
              <h1 className='Title-logo'>ELECTRON-TRIAL</h1>
              <span className='version'>v{version}</span>
            </div>
            <p data-flex='cross:center'>
              <Icon type="wechat" />
              <span>unbolibobo</span>
            </p>
            <p data-flex='cross:center'>
              <Icon type="qq" />
              <span>122760248</span>
            </p>
            <p data-flex='cross:center'>
              <Icon type="github" />
              <span>https://github.com/Bendjen</span>
            </p>

          </div>
        </Modal>
      </div>


    )
  }
}

export default Header;
