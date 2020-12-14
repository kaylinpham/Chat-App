import React, { Component } from "react";
import Box from "./Box";
import "./css/Home.css";
import MyTyping from "./MyTyping";
import Partner from "./Partner";
import People from "./People";
import Search from "./Search";
import Profile from "./Profile";
import { db } from "../App";
import * as f from "../Controllers";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { roomID: "", document: [] };
    this.onActive = this.onActive.bind(this);
    this.setDocument = this.setDocument.bind(this);
    this.showMessage = this.showMessage.bind(this);
    // this.setLastMessages = this.setLastMessages.bind(this);
  }
  componentDidMount() {
    const owner = this.props.data;
    console.log(owner)
    const obj = this;
    // console.log(owner);
    f.getChatrooms(owner.ID).then((res) => {
      obj.setState({ document: res, roomID: res[0].ID });
      obj.onActive(res[0].ID);
      f.getLastMessages(res).then((result) => {
        obj.setState({ lastMessages: result });
      });
    });
    f.getUsers(owner.ID).then((res) => {
      obj.setState({ friends: res });
    });
  }
  onActive(roomID) {
    const obj = this;
    const owner = obj.props.data;
    let partnerID = "";
    obj.setState({ roomID: roomID });
    f.getChatroom(roomID)
      .then((res) => {
        partnerID = owner.ID === res.user1 ? res.user2 : res.user1;
      })
      .then(() => {
        f.getUser(partnerID).then((res) => {
          obj.setState({ currentPartner: res });
          this.showMessage();
        });
      });
  }
  setDocument() {
    const owner = this.props.data;
    const obj = this;
    f.getChatrooms(owner.ID).then((res) => {
      obj.setState({ document: res });
    });
  }
  // setLastMessages() {
  //   f.getLastMessages(this.state.document).then((res) => {
  //     this.setState({ lastMessages: res });
  //   });
  // }
  showMessage() {
    const obj = this;
    const owner = obj.props.data;
    const roomID = obj.state.roomID;
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
          obj.setState({ messages: messages });
        })
        .then(() => {
          obj.setState({ conversation: conversation });
          let el = document.getElementById("conversation");
          el.scrollTop = el.scrollHeight;
        });
    }
  }
  render() {
    const data = this.props.data;
    return (
      <div className="home">
        <div className="contacts">
          <Profile data={data} />
          <People
            friends={this.state.friends ? this.state.friends : []}
            roomID={this.state.roomID}
            onActive={this.onActive}
            owner={data}
            data={this.state.document}
          />
        </div>
        <div className="individual">
          <Partner
            guest={this.state.currentPartner ? this.state.currentPartner : {}}
          />
          <Box conversation={this.state.conversation} />
          <MyTyping
            messages={this.state.messages}
            showPeople={this.setDocument}
            onActive={this.onActive}
            owner={data}
            roomID={this.state.roomID}
          />
        </div>
      </div>
    );
  }
}

export default Home;
