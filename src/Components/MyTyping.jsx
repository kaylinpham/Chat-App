import React, { Component } from 'react';
import "./css/MyTyping.css";
const MyTyping = (props) => {
    return ( 
        <div className="typing__area">
            <input type="text" placeholder="Nhập tin nhắn..."/>
        </div>
     );
}
 
export default MyTyping;