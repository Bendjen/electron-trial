// import { hot } from 'react-hot-loader/root';
import React from 'react';
import './index.css';
import axios from "axios";
import { Button, notification } from 'antd';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Body, Header, Menu } from "../layout/index";
import Home from "../pages/home"

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.openNotification()
  }
  handleClick() {
    axios.post('/api/test', { value: 1 }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }
  openNotification() {
    const key = 'updateNotification';
    const btnUpdate = (
      <Button type="primary" key="update" style={{ marginRight: 20, marginTop: 10 }}>更新</Button>
    );
    const btnCancel = (
      <Button style={{ marginTop: 10 }}  key="cancel" onClick={() => { notification.close('updateNotification') }}>取消</Button>
    )
    const btn = (
      <Button>更新</Button>
    );
    notification.open({
      message: '更新',
      duration: null,
      description:
        'electron-trial 存在新版本 v1.1.0，是否要下载更新？',
      btn: [btnUpdate, btnCancel],
      key,
      onClose: () => { notification.close('updateNotification') },
    });
  }
  render() {
    const Main = () => (
      <Body>
        {/* <Switch> */}
        <Route exact={true} path="/" component={Home} />
        {/* </Switch> */}
      </Body>
    );
    return (
      <Router>
        <div className='rootConatiner'>
          <Header />
          <Menu />
          <Main />
        </div>
      </Router>
    );
  }
}

export default App;
