import React from "react";
import "./index.scss";
import { Alert, Icon, Button, Modal, notification } from 'antd';
const { remote } = require('electron');

class Dialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [
        {
          title: '渲染进程的对话框',
          description: '在渲染进程内触发的定制对话框，这里采用的是antd的Modal组件',
          icon: 'alert',
          handleOpen: () => {
            Modal.info({
              title: '提示',
              content: '这是一条HTML提示信息。',
              centered: true
            })
          }
        },
        {
          title: '系统提示对话框',
          description: '在主进程通过dialog.showMessageBox发起的与系统风格一致的信息框',
          icon: 'info-circle',
          handleOpen: () => {
            remote.dialog.showMessageBox({
              type: 'info',
              title: '提示',
              message: '这是一条系统提示信息。',
            })
          }
        },
        {
          title: '系统错误对话框',
          description: '在主进程通过dialog.showErrorBox发起的与系统风格一致的错误提示框',
          icon: 'close-circle',
          handleOpen: () => {
            remote.dialog.showErrorBox('错误', '这是一条错误提示。')
          }
        },
        {
          title: '文件选择框',
          description: '在主进程通过dialog.showOpenDialog发起的文件选择框',
          icon: 'file',
          handleOpen: () => {
            remote.dialog.showOpenDialog({
              properties: ['openFile']
            }, (data) => {
              if (data) {
                notification.info({
                  message: '文件选择',
                  description:
                    `您选择了文件：${data[0]}`,
                });
              }
            })
          }
        },
      ]
    }
  }
  render() {
    return (
      <div className='dialogContainer'>
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
            <Button className='windowOpenButton' onClick={item.handleOpen.bind(this)}>打开</Button>
          </div>
        ))}
      </div>
    )
  }
}

export default Dialog;
