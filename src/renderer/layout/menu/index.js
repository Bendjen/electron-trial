import React from "react";
import { Link } from "react-router-dom";
import { Menu, Icon } from 'antd';
import "./index.scss";


class MenuBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultSelectedKeys: [location.href.split('#/')[1] || 'home']
    }

  }

  render() {
    return (
      <div className='menuContainer'>
        <div className='Header-logo' data-flex='cross:center'>
          <i className="iconfont icon-kafeidou" />
          <span className='logo'>Bendjen</span>
        </div>
        <Menu
          defaultSelectedKeys={this.state.defaultSelectedKeys}
          style={{ width: 256 }}
          theme="dark"
          mode="inline"
        >
          <Menu.Item key="home">
            <Link to='/home'>
              <Icon type="home" />
              <span>主页</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="window">
            <Link to='window'>
              <Icon type="layout" />
              <span>窗口</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="dialog">
            <Link to='/dialog'>
              <Icon type="bell" />
              <span>对话框</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="communication">
            <Link to='/communication'>
              <Icon type="message" />
              <span>进程间通信</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="dataSharing">
            <Link to='/dataSharing'>
              <Icon type="apartment" />
              <span>数据共享</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="printer">
            <Link to='/printer'>
              <Icon type="printer" />
              <span>打印</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="other">
            <Link to='/other'>
              <Icon type="gold" />
              <span>其它</span>
            </Link>
          </Menu.Item>
        </Menu>
      </div>
    )
  }
}

export default MenuBar;
