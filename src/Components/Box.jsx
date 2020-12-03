import React, { Component } from "react";
import "./css/Box.css";
import { db } from "../App";

const Box = (props) => {
  return <div className="box__chat">{props.conversation}</div>;
};
export default Box;
