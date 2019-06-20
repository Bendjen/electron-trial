import React from "react";
import "./index.scss";
import { Alert, Icon, Button, Switch, Input, notification } from 'antd';
const { ipcRenderer, remote, clipboard, desktopCapturer, shell } = require('electron');
const { Menu, MenuItem } = remote
const os = require('os')
const path = require('path')
const fs = require('fs')


const menu = new Menu()
menu.append(new MenuItem({ label: 'MenuItem1', click() { console.log('item 1 clicked') } }))
menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }))

class Other extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copyInput: 'https://electronjs.org',
      pasteInput: ''
    }
  }
  switchMenuTop(value) {
    if (value) {
      notification.success({
        message: '开启菜单栏',
        description: `已添加顶部菜单栏`,
      });
    }else{
      notification.warning({
        message: '关闭菜单栏',
        description: `已关闭顶部菜单栏`,
      });
    }
    ipcRenderer.send("TOGGLE-MENU-TOP", value)
  }
  switchMenuPopup(value) {
    if (value) {
      notification.success({
        message: '开启右击选项栏',
        description: `右击查看更多选项`,
      });
      document.addEventListener('contextmenu', this.contextMenuListener)
    } else {
      notification.warning({
        message: '关闭右击选项栏',
        description: `已关闭右击选项栏`,
      });
      document.removeEventListener('contextmenu', this.contextMenuListener)
    }
  }
  contextMenuListener(e) {
    e.preventDefault()
    menu.popup({ window: remote.getCurrentWindow() })
  }
  copyText() {
    clipboard.write({
      text: this.state.copyInput
    })
    notification.success({
      message: '复制成功',
      description: `已成功复制导剪贴板`,
    });
  }
  pasteText() {
    this.setState({
      pasteInput: clipboard.readText()
    })
  }
  handleChange(e) {
    this.setState({
      copyInput: e.target.value
    })
  }
  crash() {
    ipcRenderer.send('CRASH')
  }
  screenShot() {
    const thumbSize = this.determineScreenShotSize()
    let options = { types: ['screen'], thumbnailSize: thumbSize }
    desktopCapturer.getSources(options, (error, sources) => {
      if (error) return console.log(error)
      sources.forEach((source) => {
        if (source.name === 'Entire screen' || source.name === 'Screen 1') {
          const screenshotPath = path.join(os.tmpdir(), 'screenshot.png')
          fs.writeFile(screenshotPath, source.thumbnail.toPNG(), (error) => {
            if (error) return console.log(error)
            notification.success({
              message: '截屏成功',
              description: `文件地址已复制到剪贴板`,
            });
            clipboard.write({
              text: screenshotPath
            })
            shell.openExternal(`file://${screenshotPath}`)
          })
        }
      })
    })
  }
  determineScreenShotSize() {
    return {
      width: screen.width * window.devicePixelRatio,
      height: screen.height * window.devicePixelRatio
    }
  }
  render() {
    return (
      <div className='otherContainer'>
        <div className='line'>
          <h1># 快捷键</h1>
          <div className='line' data-flex="cross:center">
            <Alert
              style={{ width: '100%' }}
              message='刷新页面'
              description='Ctrl + F5'
              type="info"
              showIcon
              icon={(<Icon type='reload' />)}
            />
          </div>
          <div className='line' data-flex="cross:center">
            <Alert
              style={{ width: '100%' }}
              message='开发者工具'
              description='Ctrl + F12'
              type="info"
              showIcon
              icon={(<Icon type='chrome' />)}
            />
          </div>
        </div>
        <div className='line'>
          <h1># 菜单</h1>
          <div className='line' data-flex="cross:center">
            <Alert
              style={{ width: '100%' }}
              message='顶部菜单栏'
              description='点击开关，控制顶部菜单栏的显示'
              type="info"
              showIcon
              icon={(<Icon type='menu' />)}
            />
            <Switch className='fix' onChange={this.switchMenuTop.bind(this)} />
          </div>
          <div className='line' data-flex="cross:center">
            <Alert
              style={{ width: '100%' }}
              message='右键选项'
              description='点击开关，控制是否能在该页面通过右击显示更多选项'
              type="info"
              showIcon
              icon={(<Icon type='bars' />)}
            />
            <Switch className='fix' onChange={this.switchMenuPopup.bind(this)} />
          </div>
        </div>

        <div className='line'>
          <h1># 屏幕截图</h1>
          <div className='line' data-flex="cross:center">
            <Alert
              style={{ width: '100%' }}
              message='屏幕截图'
              description='截取屏幕'
              type="info"
              showIcon
              icon={(<Icon type='picture' />)}
            />
            <Button type="primary" onClick={this.screenShot.bind(this)} className='fix'> 截取 </Button>
          </div>
        </div>

        {/* <div className='line'>
          <h1># 程序崩溃</h1>
          <div className='line' data-flex="cross:center">
            <Alert
              style={{ width: '100%' }}
              message='程序崩溃'
              description='必要时使客户端崩溃以提供保护'
              type="info"
              showIcon
              icon={(<Icon type='frown' />)}
            />
            <Button type="primary" onClick={this.crash.bind(this)} className='fix'> 崩溃 </Button>
          </div>
        </div> */}

        <div className='line'>
          <h1># 复制粘贴</h1>
          <div className='line' data-flex="cross:center">
            <Input size="large" value={this.state.copyInput} onChange={this.handleChange.bind(this)} style={{ width: 300, marginRight: 40 }} placeholder="输入文本，点击复制" />
            <Button type="primary" onClick={this.copyText.bind(this)} size='large'> 复制 </Button>
          </div>
          <div className='line' data-flex="cross:center">
            <Input size="large" disabled value={this.state.pasteInput} style={{ width: 300, marginRight: 40 }} placeholder="点击粘贴，将写入剪贴板的文本" />
            <Button type="primary" onClick={this.pasteText.bind(this)} size='large'> 粘贴 </Button>
          </div>
        </div>

      </div>
    )
  }
}

export default Other;
