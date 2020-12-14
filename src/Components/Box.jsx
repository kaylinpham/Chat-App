import React from "react";
import "./css/Box.css";


const Box = (props) => {
  return (
    <div id="conversation" className="box__chat">
      {props.conversation}
      <div className="VideoChatMain">
        
      </div>
    </div>
  );
};
export default Box;

