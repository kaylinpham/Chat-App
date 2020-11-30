import React, { Component } from "react";
import "./css/Partner.css";
import { db } from "../App";

class Partner extends Component {
  constructor(props) {
    super(props);
    this.state = { partner: {}, partnerID: "", room: {} };
    this.componentDidCatch = this.componentDidMount.bind(this);
  }
  componentDidMount() {
    const owner = this.props.owner;
    const roomID = this.props.roomID;
    const obj = this;
    if (roomID !== "") {
      db.collection("chatrooms")
        .doc(roomID)
        .get()
        .then((doc) => {
          let room = doc.data();
          let partnerID = room.user1 === owner.ID ? room.user2 : room.user1;
          obj.setState({ partnerID: partnerID, room: room });
        })
        .then(() => {
          db.collection("users")
            .doc(obj.state.partnerID)
            .get()
            .then((doc) => {
              let partner = doc.data();
              obj.setState({ partner: partner });
            });
        });
    }
  }
  timeDifference(date1, date2) {
    let difference = date1.toTimeString() - date2.toTimeString();

    let daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
    difference -= daysDifference * 1000 * 60 * 60 * 24;

    let hoursDifference = Math.floor(difference / 1000 / 60 / 60);
    difference -= hoursDifference * 1000 * 60 * 60;

    let minutesDifference = Math.floor(difference / 1000 / 60);
    difference -= minutesDifference * 1000 * 60;

    let secondsDifference = Math.floor(difference / 1000);

    return (
      daysDifference +
      " day/s " +
      hoursDifference +
      " hour/s " +
      minutesDifference +
      " minute/s " +
      secondsDifference +
      " second/s "
    );
  }
  render() {
    return (
      <div className="partner__profile">
        <div className="partner__img-container">
          <img className="partner__img" src={this.state.partner.Avatar} />
        </div>
        <div className="partner__details">
          <p>
            <b>{this.state.partner.Fullname}</b>
          </p>
          <span>Hoạt độnggit  1 giờ trước</span>
        </div>
      </div>
    );
  }
}

export default Partner;
