import React from "react";
import { Link } from "react-router-dom";
import { Menu, Dropdown, Icon, Progress, Button, Modal } from 'antd';
import "./index.scss";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    }
  }
  render() {
    const { checkUpdate, emitUpdate, emitInstall, existNewVersion, downloading, available, newVersion, version, progress } = this.props
    const moreMenu = (
      <Menu>
        <Menu.Item key="about" onClick={() => this.setState({ modal: true })}>关于</Menu.Item>
        <Menu.Item key="update" onClick={checkUpdate}>检查更新</Menu.Item>
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
            <Button type="primary" style={{ marginLeft: 15 }} size='small' onClick={emitUpdate}>更新</Button>
          </div>
        </Menu.Item>
      </Menu>
    )
    const installMenu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="install">
          <div data-flex='cross:center'>
            <span data-flex='cross:center'> 新版本 <span style={{ color: '#1890FF' }}>{newVersion}</span> 已准备就绪，是否要安装？</span>
            <Button type="primary" style={{ marginLeft: 15 }} size='small' onClick={emitInstall}>安装</Button>
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
                to="/about"
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
