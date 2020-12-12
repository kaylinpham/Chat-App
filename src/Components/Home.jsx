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

import {Picker} from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      roomID: "", 
      document: [],
      // thêm value
      value:"", 
    }; 
    this.onActive = this.onActive.bind(this);
    this.setDocument = this.setDocument.bind(this);
  }
  componentDidMount() {
    const owner = this.props.data;
    console.log(owner)
    const obj = this;
    f.getChatrooms(owner.ID).then((res) => {
      console.log(res)
      obj.setState({ document: res, roomID: res[0].ID });
      obj.onActive(res[0].ID);
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

  // showEmoji = () => {
  //   this.setState({showEmoji: !this.state.showEmoji})
  // }
  // addEmoji = (e) => {
  //   console.log("emoji clicked")
  //   let emoji = e.native;
  //   this.setState({
  //     value: this.state.value + emoji
  //   });
  // }

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
            owner={data}
            data={this.state.document}
          />
        </div>
        <div className="individual">
          <Partner
            guest={this.state.currentPartner ? this.state.currentPartner : {}}
          />
          <Box owner={data} roomID={this.state.roomID} />
          <MyTyping showPeople={this.setDocument}
            onActive={this.onActive}
            owner={data}
            roomID={this.state.roomID}
            // thêm
            // showEmoji={this.showEmoji}
            // addEmoji={this.addEmoji}
          />
        </div>
        {/* {this.state.showEmoji ? <Picker onSelect={this.addEmoji}/> : null} */}
      </div>
    );
  }
}

export default Home;
