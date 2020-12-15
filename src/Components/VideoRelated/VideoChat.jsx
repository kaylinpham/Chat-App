import React, { useState, useCallback, useEffect } from "react";

import Room from "./Room";
import "../css/VideoRelated/VideoChat.css";
import { db } from "../../App";

const VideoChat = (props) => {
  const [userVideoChat, setUserVideoChat] = useState("");
  const [userVideoChatID, setUserVideoChatID] = useState("");
  const [roomNameVideo, setRoomNameVideo] = useState("");
  const [targetVideoChatID, setTargetVideoChatID] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    console.log(userVideoChat);
    console.log(userVideoChatID);
    console.log(roomNameVideo);
    console.log(targetVideoChatID);
  }, [userVideoChat, userVideoChatID, roomNameVideo, targetVideoChatID]);

  useEffect(() => {
    setTargetVideoChatID(props.dataFromPartnerToVideoChat.ID);
  }, [props.dataFromPartnerToVideoChat.ID]);

  useEffect(() => {
    let usernameLocal = JSON.parse(window.localStorage.getItem("user"))
      .username;
    let userIDLocal = JSON.parse(window.localStorage.getItem("user")).ID;
    setUserVideoChat(usernameLocal);
    setUserVideoChatID(userIDLocal);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      try {
        let idRoom = await db
          .collection("randomRoomId")
          .add({
            tempVideoRoom: userVideoChat,
          })
          .then((DocRef) => {
            return DocRef.id;
          });
        console.log(idRoom);
        setRoomNameVideo(idRoom);
        // console.log(props.dataFromPartnerToVideoChat.ID);
        // console.log(targetVideoChatID);
        const data = await fetch("/video/token", {
          method: "POST",
          body: JSON.stringify({
            identity: "you",
            room: idRoom,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json());
        setToken(data.token);
      } catch (e) {
        console.log(e.message);
      }
    },
    [roomNameVideo, userVideoChat]
  );

  const handleSubmit2 = useCallback(
    async (event) => {
      try {
        let a = db
          .collection("users")
          .doc(userVideoChatID)
          .get()
          .then((doc) => doc.data().roomId);

        const data = await fetch("/video/token", {
          method: "POST",
          body: JSON.stringify({
            identity: "userVideoChat",
            room: a,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json());
        setToken(data.token);
      } catch (e) {
        console.log(e.message);
      }
    },
    [roomNameVideo, userVideoChat]
  );

  const handleSubmit3 = () => {
    db.collection("users").doc(targetVideoChatID).set(
      {
        calling: true,
        roomId: roomNameVideo,
      },
      { merge: true }
    );
  };

  const handleLogout = useCallback((event) => {
    setToken(null);
    console.log(userVideoChatID);
  }, []);

  let render;
  if (token) {
    console.log(roomNameVideo);
    render = (
      <div>
        <button className="callButton" onClick={handleSubmit3}>
          allow
        </button>

        <Room
          roomNameVideo={roomNameVideo}
          token={token}
          handleLogout={handleLogout}
        />
      </div>
    );
  } else {
    render = (
      <div className="callButtonMainDiv">
        <button className="callButton" onClick={handleSubmit}>
          📹
        </button>

        <button className="callButton" onClick={handleSubmit2}>
          test
        </button>
      </div>
    );
  }

  return render;
};

export default VideoChat;
