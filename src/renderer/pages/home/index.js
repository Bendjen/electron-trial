import React from "react";
import "./index.scss";
class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log(process.versions)
    return (
      <div className='homeContainer' data-flex='dir:top main:center corss:center'>
        <div data-flex='main:center corss:center'>
          <img className='App-logo' src='../../../../public/assets/electron-logo.png'></img>
          <h1 className='Title-logo'>ELECTRON</h1>
          <span className='version'>v1.0.0</span>
        </div>
          <p  data-flex='main:center corss:center'>
            <span>Electron：</span>
            <span>{process.versions.electron}</span>
          </p>
          <p data-flex='main:center corss:center'>
            <span>Node：</span>
            <span>{process.versions.node}</span>
          </p>
          <p data-flex='main:center corss:center'>
            <span>Chrome：</span>
            <span>{process.versions.chrome}</span>
          </p>

      </div>
    )
  }
}

export default Home;
