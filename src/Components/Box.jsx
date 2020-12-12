import React, { Component } from "react";
import "./css/Box.css";
import { db } from "../App";
import * as f from "../Controllers";

// const Box = (props) => {
//   return (
//     <div id="conversation" className="box__chat">
//       {props.conversation}
//     </div>
//   );
// };
// export default Box;
let reRender = 0;
class Box extends Component {
  constructor(props) {
    super(props);
    this.state = {
      conversation: []

    };
    this.showMessage = this.showMessage.bind(this);
  }
  componentDidMount() {
    this.showMessage();
  }
  componentDidUpdate(prevProps, prevState) {
    console.log('didUpdate')
    const { roomID, owner } = this.props;
    // console.log('didUpdate')
    // console.log(owner)
    // console.log(roomID)
    // console.log(prevProps.roomID)
    if (prevProps.roomID !== roomID) {
      this.showMessage()
    }
    // if (reRender === 0) {
    //   reRender = 1;
    //   this.showMessage();
    // }
  }
  showMessage() {
    const obj = this;
    const owner = obj.props.owner;
    const roomID = obj.props.roomID;
    let conversation = [];
    if (roomID !== "") {
      f.subscribeConversation(roomID, (message) => {
        this.setState((old) => {
          let conversation = JSON.parse(JSON.stringify(old.conversation))
          conversation.push(message)
          return {...old,conversation}

        })
      })

    }
  
    //     // console.log(this.state)
    //     // let mess;
    //     // if (message.content !== "" && message.roomID === roomID) {
    //     //   mess = (<div className="message">
    //     //     <p className={message.sender === owner.ID ? "right" : "left"}>
    //     //       {message.content}
    //     //     </p>
    //     //   </div>)
    //     // }
    //     // // console.log(message)
    //     // let conversation = JSON.parse(JSON.stringify(this.state.conversation))
    //     // conversation.push(mess)
    //     // obj.setState({ conversation: conversation });
    //     // let el = document.getElementById("conversation");
    //     // el.scrollTop = el.scrollHeight;
    //   })
    //   // .then((messages) => {
    //   //   messages.forEach((message) => {
    //   //     if (message.content !== "" && message.roomID === roomID) {
    //   //       conversation.push(
    //   //         <div className="message">
    //   //           <p className={message.sender === owner.ID ? "right" : "left"}>
    //   //             {message.content}
    //   //           </p>
    //   //         </div>
    //   //       );
    //   //     }
    //   //   });
    //   // })
    //   // .then(() => {
    //   //   obj.setState({ conversation: conversation });
    //   //   let el = document.getElementById("conversation");
    //   //   el.scrollTop = el.scrollHeight;
    //   // });
    // }
  }
  render() {
    reRender = 0;
    return (
      <div id="conversation" className="box__chat">
        {
          this.state.conversation.map(message => {
            const owner = this.props.owner;
            const roomID = this.props.roomID;
            return (<div className="message">
              <p className={message.sender === owner.ID ? "right" : "left"}>
                {message.content}
              </p>
            </div>)
          })
        }
      </div>
    );
  }
}

export default Box;
