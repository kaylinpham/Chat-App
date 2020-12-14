import React, { Component } from "react";
import "./css/MyTyping.css";
import { db } from "../App";
import * as f from "../Controllers";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import VideoChat from '../Components/VideoRelated/VideoChat'

class MyTyping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      showEmoji: false,
    };
    this.sendMessage = this.sendMessage.bind(this);
  }
  handleChange = (e) => {
    this.setState({ value: e.target.value });
  };
  showEmoji = () => {
    this.setState({ showEmoji: !this.state.showEmoji });
  };
  addEmoji = (e) => {
    let emoji = e.native;
    let currentValue = this.state.value;
    this.setState({
      value: currentValue + emoji,
    });
  };
  sendMessage(e) {
    e.preventDefault();
    let messages = this.props.messages;
    const obj = this;
    let date = new Date();
    let value = e.target.value;
    if ((e.keyCode === 13) & (value !== "")) {
      // e.target.value = "";
      db.collection("messages")
        .add({
          content: value,
          date: date,
          roomID: obj.props.roomID,
          sender: obj.props.owner.ID,
        })
        .then((doc) => {
          doc.update({
            ID: doc.id,
          });
          let mes = {
            content: value,
            date: date,
            sender: obj.props.owner.ID,
            roomID: obj.props.roomID,
            ID: doc.id,
          };
          messages.push(mes);
        });
      db.collection("chatrooms").doc(obj.props.roomID).update({
        modifiedDate: date,
      });
      // .then(() => {
      //   f.subscribeConversation(obj.props.roomID, () => {
      //     obj.props.onActive(obj.props.roomID);
      //     obj.props.showPeople();
      //   });
      // });
      this.setState({ value: "" });
      var sfDocRef = db.collection("chatrooms").doc(obj.props.roomID);
      return db.runTransaction(function (transaction) {
        return transaction.get(sfDocRef).then(function (sfDoc) {
          if (!sfDoc.exists) {
            throw "Document does not exist!";
          }
          var newMessages = messages;
          transaction.update(sfDocRef, { message: newMessages });
          f.subscribeConversation(obj.props.roomID, () => {
            obj.props.onActive(obj.props.roomID);
            obj.props.showPeople();
          });
        });
      });
    }
  }
  render() {
    return (
      <div className="typing__area">
        
        
        <input
          onChange={this.handleChange}
          onKeyUp={this.sendMessage}
          type="text"
          placeholder="Nhập tin nhắn..."
          value={this.state.value}
        />
        <span id="sympol" onClick={this.showEmoji}>
          {"😎"}
        </span>
        <div className="emoji">
          {this.state.showEmoji ? <Picker onSelect={this.addEmoji} /> : null}
        </div>
        
      </div>
    );
  }
}

export default MyTyping;
