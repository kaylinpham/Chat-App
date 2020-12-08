import React, { Component } from "react";
import "./css/Box.css";
import { db } from "../App";
import * as f from "../Controllers";

// const Box = (props) => {
//   return (
//     <div id="conversation" className="box__chat">
//       {props.conversation}
//     </div>
//   );
// };
// export default Box;
let reRender = 0;
class Box extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.showMessage = this.showMessage.bind(this);
  }
  componentDidMount() {
    this.showMessage();
  }
  componentDidUpdate() {
    if (reRender === 0) {
      reRender = 1;
      this.showMessage();
    }
  }
  showMessage() {
    const obj = this;
    const owner = obj.props.owner;
    const roomID = obj.props.roomID;
    let conversation = [];
    if (roomID !== "") {
      f.getMessagesOf(roomID)
        .then((messages) => {
          messages.forEach((message) => {
            if (message.content !== "" && message.roomID === roomID) {
              conversation.push(
                <div className="message">
                  <p className={message.sender === owner.ID ? "right" : "left"}>
                    {message.content}
                  </p>
                </div>
              );
            }
          });
        })
        .then(() => {
          obj.setState({ conversation: conversation });
          let el = document.getElementById("conversation");
          el.scrollTop = el.scrollHeight;
        });
    }
  }
  render() {
    reRender = 0;
    return (
      <div id="conversation" className="box__chat">
        {this.state.conversation}
      </div>
    );
  }
}

export default Box;
