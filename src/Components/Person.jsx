import React, { Component } from "react";
import Avatar from "./Avatar";
import "./css/Person.css";
import Quickview from "./Quickview";
import { db } from "../App";
let reRender = 0;
class Person extends Component {
  constructor(props) {
    super(props);
    this.state = { data: {} };
    this.handle = this.handle.bind(this);
  }
  componentDidMount() {
    const obj = this;
    const owner = obj.props.owner;
    const partner = obj.props.private;
    const partnerID =
      partner.user1 === owner.ID ? partner.user2 : partner.user1;
    db.collection("users")
      .doc(partnerID)
      .get()
      .then((doc) => {
        obj.setState({ data: doc.data() });
      });
  }
  componentDidUpdate() {
    if (reRender === 0) {
      const obj = this;
      const owner = obj.props.owner;
      const partner = obj.props.private;
      const partnerID =
        partner.user1 === owner.ID ? partner.user2 : partner.user1;
      db.collection("users")
        .doc(partnerID)
        .get()
        .then((doc) => {
          obj.setState({ data: doc.data() });
        });
    }
    reRender = 1;
  }
  handle(e) {
    {
      this.props.onActive(e.currentTarget.id);
    }
  }
  render() {
    reRender = 0;
    return (
      <div
        onClick={this.handle}
        id={this.props.private.ID}
        className={this.props.className}
      >
        <Avatar url={this.state.data.Avatar} />
        <Quickview
          owner={this.props.owner}
          room={this.props.private}
          data={this.state.data}
        />
      </div>
    );
  }
}

export default Person;
