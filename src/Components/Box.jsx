import React, { Component } from "react";
import "./css/Box.css";
import { db } from "../App";
import * as f from "../Controllers";

const Box = (props) => {
  return (
    <div id="conversation" className="box__chat">
      {props.conversation}
    </div>
  );
};
export default Box;

