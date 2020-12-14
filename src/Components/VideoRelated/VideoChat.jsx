import React, { useState, useCallback, useEffect } from 'react';

import Room from './Room';
import '../css/VideoRelated/VideoChat.css'
import {db} from '../../App'

const VideoChat = () => {
  const [userVideoChat, setUserVideoChat] = useState('');
  const [roomNameVideo, setRoomNameVideo] = useState('');
  const [token, setToken] = useState(null);

  
  
    

  const handleSubmit = useCallback(
    async event => {
      await setRoomNameVideo("heyfromset")
      event.preventDefault();
      const data = await fetch('/video/token', {
        method: 'POST',
        body: JSON.stringify({
          identity: "userVideoChat",
          room: roomNameVideo
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json());
      setToken(data.token);
    },
    [roomNameVideo, userVideoChat]
  );

  const handleSubmit2 = useCallback(
    async event => {
      await db.collection("randomRoomId").add({
        name: userVideoChat
    })
    .then(function(docRef) {
      setRoomNameVideo (docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
      event.preventDefault();
      const data = await fetch('/video/token', {
        method: 'POST',
        body: JSON.stringify({
          identity: "fei2",
          room: roomNameVideo
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json());
      setToken(data.token);
    },
    [roomNameVideo, userVideoChat]
  );

  const handleLogout = useCallback(event => {
    setToken(null);
  }, []);

  let render;
  if (token) {
    render = (
      <Room roomNameVideo={roomNameVideo} token={token} handleLogout={handleLogout} />
    );
  } else {
    render = (
      <div>
      <button className="callButton" onClick={handleSubmit}>📹</button>
      <button className="callButton" onClick={handleSubmit2}>test</button>
      </div>
    );
  }
  return render;
};

export default VideoChat;