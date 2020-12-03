import React, { Component } from "react";
import Box from "./Box";
import "./css/Home.css";
import MyTyping from "./MyTyping";
import Partner from "./Partner";
import People from "./People";
import Search from "./Search";
import Profile from "./Profile";
import { db } from "../App";
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
    let people = [];
    let partner = [];
    let document = [];
    let mytyping = [];
    db.collection("chatrooms")
      .orderBy("modifiedDate", "desc")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          if (
            data.user1 === obj.props.data.ID ||
            data.user2 === obj.props.data.ID
          ) {
            document.push(data);
          }
        });
        obj.setState({
          roomID: document[0].ID ? document[0].ID : "",
          document: document,
          first: document[0],
          currentRoom: document[0],
        });
      })
      .then(() => {
        let objectID =
          obj.props.data.ID === obj.state.first.user1
            ? obj.state.first.user2
            : obj.state.first.user1;
        obj.onActive(obj.state.currentRoom.ID);
        // db.collection("users")
        //   .doc(objectID)
        //   .get()
        //   .then((doc) => {
        //     obj.setState({ firstPartner: doc.data() });
        //     setTimeout(() => {
        //       people.push(
        //         <People
        //           roomID={obj.state.roomID}
        //           onActive={obj.onActive}
        //           owner={obj.props.data}
        //           data={document}
        //         />
        //       );
        //       partner.push(
        //         <Partner
        //           guest={obj.state.firstPartner ? obj.state.firstPartner : {}}
        //         />
        //       );
        //       mytyping.push(
        //         <MyTyping
        //           onInput={obj.sentMessage}
        //           owner={obj.props.data}
        //           room={this.state.first}
        //         />
        //       );
        //       this.showMessage();
        //       obj.setState({
        //         people: people,
        //         partner: partner,
        //         mytyping: mytyping,
        //       });
        //     }, 0);
        //   });
      });
  }
  onActive(room) {
    let partner = [];
    let people = [];
    let mytyping = [];
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
              partner.push(
                <Partner
                  guest={
                    obj.state.currentPartner ? obj.state.currentPartner : {}
                  }
                />
              );
              mytyping.push(
                <MyTyping
                  onInput={obj.sentMessage}
                  owner={obj.props.data}
                  room={this.state.currentRoom}
                />
              );
              people.push(
                <People
                  roomID={obj.state.roomID}
                  onActive={obj.onActive}
                  owner={obj.props.data}
                  data={obj.state.document}
                />
              );
              this.showMessage();
              obj.setState({
                partner: partner,
                people: people,
                mytyping: mytyping,
              });
            }, 0);
          });
      });
  }
  showMessage() {
    const obj = this;
    const owner = obj.props.data;
    const room = obj.state.currentRoom;
    let conversation = [];
    let box = [];
    if (room.ID !== "") {
      db.collection("messages")
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
          obj.setState({ conversation: conversation });
        })
        .then(() => {
          box.push(<Box conversation={obj.state.conversation} />);
          obj.setState({ box: box });
        });
    }
  }
  sentMessage(e) {
    const obj = this;
    let partner = [];
    let people = [];
    let box = [];
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
                partner.push(
                  <Partner
                    guest={
                      obj.state.currentPartner ? obj.state.currentPartner : {}
                    }
                  />
                );
                people.push(
                  <People
                    roomID={obj.state.roomID}
                    onActive={obj.onActive}
                    owner={obj.props.data}
                    data={obj.state.document}
                  />
                );
                this.subscribeConversation(obj.state.currentRoom.ID, () => {
                  this.onActive(obj.state.currentRoom.ID);
                });
                obj.setState({ partner: partner, people: people });
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
          {this.state.people}
        </div>
        <div className="individual">
          {this.state.partner}
          {this.state.box}
          {this.state.mytyping}
        </div>
      </div>
    );
  }
}

export default Home;
