import React from "react";
import { Link } from "react-router-dom";
import { Menu, Dropdown, Icon } from 'antd';
import "./index.scss";


class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="about">关于</Menu.Item>
        <Menu.Item key="update">检查更新</Menu.Item>
      </Menu>
    );
    return (
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
          <Dropdown
            overlay={menu}
          >
            <a href="#">
              <Icon type="menu" />
            </a>
          </Dropdown>
        </div>
      </header>
    )
  }
}

export default Header;
