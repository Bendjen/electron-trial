import * as React from "react";
import "./index.scss";

class Body extends React.Component {
  render() {
    return <div className="body">{this.props.children}</div>;
  }
}
export default Body;
