import React, { Component } from "react";
import "./css/Quickview.css";
import * as f from "../Controllers";
let reRender = 0;
class Quickview extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    let message = [];
    const obj = this;
    f.getMessagesOf(this.props.room.ID).then((res) => {
      message = res;
      obj.setState({ message: message });
    });
  }
  componentDidUpdate() {
    if (reRender === 0) {
      let message = [];
      const obj = this;
      f.getMessagesOf(this.props.room.ID).then((res) => {
        message = res;
        obj.setState({ message: message });
      });
      reRender = 1;
    }
  }
  render() {
    let messages = this.state.message ? this.state.message : [];
    let theLast = messages[messages.length - 1]
      ? messages[messages.length - 1].content
      : "";
    let senderID = messages[messages.length - 1]
      ? messages[messages.length - 1].sender
      : "";
    reRender = 0;
    return (
      <div className="quickview">
        <b>{this.props.data.Fullname}</b>
        <p>
          {senderID === this.props.owner.ID ? "Bạn: " : ""}
          {theLast ? theLast : "Giờ đây các bạn có thể trò chuyện với nhau."}
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
