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
    let emoji = e.native;
    let currentValue = this.state.value;
    this.setState({
      value: currentValue + emoji
    });
  }
  //

  sendMessage(e) {
    e.preventDefault();
    const obj = this;
    let date = new Date();
    let value =  e.target.value // code of Giang

    this.setState({value: value})
    if ((e.keyCode === 13) & (value !== "")) {
     
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
    this.setState({value: ""})

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
          value={this.state.value}
        />
        <span onClick={this.showEmoji}>{'😎'}</span>
        {this.state.showEmoji ? <Picker onSelect={this.addEmoji} /> : null}
        {/* {this.state.showEmoji ? <Picker onSelect={this.props.addEmoji} /> : null} */}
      </div>
    );
  }
}

export default MyTyping;

