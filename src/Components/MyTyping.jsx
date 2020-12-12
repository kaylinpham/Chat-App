import React, { Component } from "react";
import "./css/MyTyping.css";
import { db } from "../App";
import * as f from "../Controllers";

import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'

class MyTyping extends Component {
  constructor(props) {
    super(props);
    this.sendMessage = this.sendMessage.bind(this);

    //
    this.state = {
      value: '',
      showEmoji: false,
    }
  }

  //
  handleChange = (e) => {
    this.setState({ value: e.target.value })
  }
  showEmoji = () => {
    this.setState({ showEmoji: !this.state.showEmoji })
  }
  addEmoji = (e) => {
    console.log("emoji clicked")
    let emoji = e.native;
    this.setState({
      // value: this.state.value + emoji
      value: 'emoji clicked' + emoji
    });
  }
  //

  sendMessage(e) {
    e.preventDefault();
    const obj = this;
    let date = new Date();
    let value = e.target.value; // code of Giang
    // thêm emoji
    // let value = this.state.value
    // console.log(this.state.value)

    //
    if ((e.keyCode === 13) & (value !== "")) {
    // if ((e.keyCode === 13) & (this.state.value !== "")) {
      console.log(this.state.value)
      // e.target.value = ""; 
      db.collection("messages")
        .add({
          content: value,
          // content: this.state.value,
          date: date,
          roomID: obj.props.roomID,
          sender: obj.props.owner.ID,
        })
        .then((doc) => {
          doc.update({
            ID: doc.id,
          });
        });
      db.collection("chatrooms")
        .doc(obj.props.roomID)
        .update({
          modifiedDate: date,
        })
        // .then(() => {
        //   f.subscribeConversation(obj.props.roomID, () => {
        //     obj.props.onActive(obj.props.roomID);
        //     obj.props.showPeople();
        //   });
        // });
    }
  }

  render() {
    return (
      <div className="typing__area">
        <input
          onChange={this.handleChange}
          onKeyUp={this.sendMessage}
          // onSubmit={this.sendMessage}
          type="text"
          placeholder="Nhập tin nhắn..."
        />
        <span onClick={this.showEmoji}>{'😎'}</span>
        {this.state.showEmoji ? <Picker onSelect={this.addEmoji} /> : null}
        {/* {this.state.showEmoji ? <Picker onSelect={this.props.addEmoji} /> : null} */}
      </div>
    );
  }
}

export default MyTyping;

