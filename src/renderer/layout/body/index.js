import * as React from "react";
import "./index.scss";

class Body extends React.Component {
  render() {
    return <div className="body">
      <div className="container">
        {this.props.children}
      </div>
    </div>;
  }
}
export default Body;
