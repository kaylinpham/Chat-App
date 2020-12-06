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
    this.state = { people: [], roomID: "", document: [] };
    this.onActive = this.onActive.bind(this);
    this.sentMessage = this.sentMessage.bind(this);
    this.showMessage = this.showMessage.bind(this);
  }
  subscribeConversation(conversationId, callback) {
    return db
      .collection("messages")
      .where("roomID", "==", conversationId)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            callback();
          }
        });
      });
  }
  componentDidMount() {
    const obj = this;
    let document = [];
    f.getChatrooms(obj.props.data.ID)
      .then((res) => {
        document = res;
        obj.setState({
          roomID: document[0].ID,
          document: document,
          first: document[0],
          currentRoom: document[0],
        });
      })
      .then(() => {
        obj.subscribeConversation(obj.state.currentRoom.ID, () => {
          obj.onActive(obj.state.currentRoom.ID);
        });
      });
  }
  onActive(room) {
    const obj = this;
    obj.setState({ roomID: room });
    db.collection("chatrooms")
      .doc(room)
      .get()
      .then((doc) => {
        obj.setState({ currentRoom: doc.data() });
        const partnerID =
          obj.state.currentRoom.user1 === obj.props.data.ID
            ? obj.state.currentRoom.user2
            : obj.state.currentRoom.user1;
        db.collection("users")
          .doc(partnerID)
          .get()
          .then((value) => {
            obj.setState({ currentPartner: value.data() });
            setTimeout(() => {
              this.showMessage();
            }, 0);
          });
      });
  }
  async showMessage() {
    const obj = this;
    const owner = obj.props.data;
    const room = obj.state.currentRoom;
    let conversation = [];
    if (room.ID !== "") {
      await db
        .collection("messages")
        .orderBy("date", "asc")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let message = doc.data();
            if (message.content !== "" && message.roomID === room.ID) {
              conversation.push(
                <div className="message">
                  <p className={message.sender === owner.ID ? "right" : "left"}>
                    {message.content}
                  </p>
                </div>
              );
            }
          });
        });
      obj.setState({ conversation: conversation });
      let el = document.getElementById("conversation");
      el.scrollTop = el.scrollHeight;
    }
  }
  sentMessage(e) {
    const obj = this;
    if (e.keyCode === 13 && e.target.value !== "") {
      db.collection("messages")
        .add({
          content: e.target.value,
          date: new Date(),
          roomID: obj.state.currentRoom.ID,
          sender: obj.props.data.ID,
        })
        .then((docRef) => {
          docRef.update({
            ID: docRef.id,
          });
          db.collection("messages")
            .doc(docRef.id)
            .get()
            .then((res) => {
              db.collection("chatrooms").doc(obj.state.currentRoom.ID).update({
                modifiedDate: res.data().date,
              });
              setTimeout(() => {
                e.target.value = "";
                setTimeout(() => {
                  obj.subscribeConversation(obj.state.currentRoom.ID, () => {
                    obj.onActive(obj.state.currentRoom.ID);
                  });
                }, 0);
              }, 0);
            });
        });
    }
  }
  render() {
    const data = this.props.data;
    return (
      <div className="home">
        <div className="contacts">
          <Profile data={data} />
          <Search />
          <People
            roomID={this.state.roomID}
            onActive={this.onActive}
            owner={this.props.data}
            data={this.state.document}
          />
        </div>
        <div className="individual">
          <Partner
            guest={this.state.currentPartner ? this.state.currentPartner : {}}
          />
          <Box conversation={this.state.conversation} />
          <MyTyping
            onInput={this.sentMessage}
            owner={this.props.data}
            room={this.state.currentRoom}
          />
        </div>
      </div>
    );
  }
}

export default Home;
