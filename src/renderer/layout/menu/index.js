import React from "react";
import { Link } from "react-router-dom";
import { Menu, Icon } from 'antd';
const { SubMenu } = Menu;
import "./index.scss";


class MenuBar extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className='menuContainer'>
        <div className='Header-logo' data-flex='cross:center'>
          <i className="iconfont icon-kafeidou" />
          <span className='logo'>Bendjen</span>
        </div>
        <Menu
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
        </Menu>
      </div>
    )
  }
}

export default MenuBar;
