import React, { Component } from "react";
import "./css/Box.css";
import { db } from "../App";
import * as f from "../Controllers";
import VideoChat from '../Components/VideoRelated/VideoChat'

const Box = (props) => {
  return (
    <div id="conversation" className="box__chat">
      {props.conversation}
      <div className="VideoChatMain">
        <VideoChat/>
      </div>
    </div>
  );
};
export default Box;

