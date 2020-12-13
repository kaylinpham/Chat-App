import React, { Component } from "react";
import Avatar from "./Avatar";
import "./css/Person.css";
import Quickview from "./Quickview";
import { db } from "../App";
class Person extends Component {
  constructor(props) {
    super(props);
    this.handle = this.handle.bind(this);
  }
  handle(e) {
    {
      this.props.onActive(e.currentTarget.id);
    }
  }
  render() {
    const data = this.props.friend;
    return (
      <div
        onClick={this.handle}
        id={this.props.room.ID}
        className={this.props.className}
      >
        <Avatar url={data.Avatar} />
        <Quickview
          owner={this.props.owner}
          data={data}
          room={this.props.room}
        />
      </div>
    );
  }
}

export default Person;
