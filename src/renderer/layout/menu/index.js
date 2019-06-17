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
      <div className='menu'>
        <Menu
          style={{ width: 256 }}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
        >
          <Menu.Item key="1">
            <Link to='/home'>主页</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to='window'>窗口</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to='/'>通知</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to='/'>通信</Link>
          </Menu.Item>
        </Menu>
      </div>
    )
  }
}

export default MenuBar;
