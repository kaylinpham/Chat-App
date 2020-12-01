import React, { Component } from "react";
import "./css/Box.css";
import { db } from "../App";

const Box = (props) => {
  const owner = props.owner;
  const room = props.room;
  let conversation = [];
  if (room.ID !== "") {
    db.collection("messages")
      .where("roomID", "==", room.ID)
      .orderBy("date", "asc")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let message = doc.data();
          if (message.content !== "") {
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
    return <div className="box__chat">{conversation}</div>;
  }
};
export default Box;
