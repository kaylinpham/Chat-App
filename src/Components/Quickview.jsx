import React, { Component } from "react";
import "./css/Quickview.css";
import * as f from "../Controllers";
let reRender = 0;
class Quickview extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let messages = this.props.room.message ? this.props.room.message : [];
    let lastMes = messages[messages.length - 1]
      ? messages[messages.length - 1]
      : {};
    return (
      <div className="quickview">
        <b>{this.props.data.Fullname}</b>
        <p>
          {lastMes
            ? lastMes.sender === this.props.owner.ID
              ? "Bạn: "
              : ""
            : ""}
          {lastMes.content
            ? lastMes.content
            : "Giờ đây các bạn có thể trò chuyện với nhau."}
        </p>
        <span>
          {new Date(
            this.props.room.modifiedDate.seconds * 1000
          ).toLocaleString()}
        </span>
      </div>
    );
  }
}
export default Quickview;
