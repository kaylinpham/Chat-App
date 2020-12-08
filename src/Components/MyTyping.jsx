import React, { Component } from "react";
import "./css/MyTyping.css";
import { db } from "../App";
import * as f from "../Controllers";
class MyTyping extends Component {
  constructor(props) {
    super(props);
    this.sendMessage = this.sendMessage.bind(this);
  }
  sendMessage(e) {
    e.preventDefault();
    const obj = this;
    let date = new Date();
    if ((e.keyCode === 13) & (e.target.value1 !== "")) {
      db.collection("messages")
        .add({
          content: e.target.value,
          date: date,
          roomID: obj.props.roomID,
          sender: obj.props.owner.ID,
        })
        .then((doc) => {
          e.target.value = "";
          doc.update({
            ID: doc.id,
          });
        });
      db.collection("chatrooms")
        .doc(obj.props.roomID)
        .update({
          modifiedDate: date,
        })
        .then(() => {
          f.subscribeConversation(obj.props.roomID, () => {
            obj.props.onActive(obj.props.roomID);
            obj.props.showPeople();
          });
        });
    }
  }
  render() {
    return (
      <div className="typing__area">
        <input
          onKeyUp={this.sendMessage}
          type="text"
          placeholder="Nhập tin nhắn..."
        />
      </div>
    );
  }
}

export default MyTyping;
