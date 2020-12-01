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
  }
  componentDidMount() {
    const obj = this;
    let people = [];
    let partner = [];
    let document = [];
    let box = [];
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
        db.collection("users")
          .doc(objectID)
          .get()
          .then((doc) => {
            obj.setState({ firstPartner: doc.data() });
            setTimeout(() => {
              people.push(
                <People
                  roomID={obj.state.roomID}
                  onActive={obj.onActive}
                  owner={obj.props.data}
                  data={document}
                />
              );
              partner.push(
                <Partner
                  guest={obj.state.firstPartner ? obj.state.firstPartner : {}}
                />
              );
              box.push(<Box owner={obj.props.data} room={this.state.first} />);
              mytyping.push(
                <MyTyping
                  onInput={obj.sentMessage}
                  owner={obj.props.data}
                  room={this.state.first}
                />
              );
              obj.setState({
                people: people,
                partner: partner,
                box: box,
                mytyping: mytyping,
              });
            }, 0);
          });
      });
  }
  onActive(room) {
    let partner = [];
    let people = [];
    let box = [];
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
              box.push(
                <Box owner={obj.props.data} room={this.state.currentRoom} />
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
              obj.setState({
                partner: partner,
                people: people,
                box: box,
                mytyping: mytyping,
              });
            }, 0);
          });
      });
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
              });
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
