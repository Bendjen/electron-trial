import React from "react";
import "./index.scss";
import { Alert, Icon, Button } from 'antd';
const { ipcRenderer } = require('electron');

class Printer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [
        {
          title: 'webContents.print()',
          description: '打印页面，调起系统的打印服务',
          icon: 'printer',
          handleOpen: () => {
            ipcRenderer.send('WINDOW-PRINT')
          }
        },
        {
          title: 'webContents.printToPDF()',
          description: '打印页面至PDF，相比于contents.print()支持更多参数的配置',
          icon: 'file-pdf',
          handleOpen: () => {
            ipcRenderer.send('WINDOW-PRINT-PDF')
          }
        }
      ]
    }
  }
  render() {
    return (
      <div className='printerContainer'>
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
            <Button className='windowOpenButton' onClick={item.handleOpen.bind(this)}>打印</Button>
          </div>
        ))}
      </div>
    )
  }
}

export default Printer;
