import React, { useState, useEffect } from "react";
import Video from "twilio-video";
import Participant from "./Participant";
import "../css/VideoRelated/RoomVideo.css";

const Room = ({ roomNameVideo, token, handleLogout }) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    Video.connect(token, {
      name: roomNameVideo,
    }).then((room) => {
      setRoom(room);
      room.on("participantConnected", participantConnected);
      room.on("participantDisconnected", participantDisconnected);
      room.participants.forEach(participantConnected);
    });

    return () => {
      setRoom((currentRoom) => {
        if (currentRoom && currentRoom.localParticipant.state === "connected") {
          currentRoom.localParticipant.tracks.forEach(function (
            trackPublication
          ) {
            trackPublication.track.stop();
          });
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [roomNameVideo, token]);

  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ));
  console.log(roomNameVideo)
  return (
    <div className="roomVideo">
      <div className="RoomVideoStatus">
        <h2>ID ROOM: {roomNameVideo}</h2>
        
        <button className="EndCall" onClick={handleLogout}>END CALL</button>
      </div>
      <div className="RoomVideoMain">
        <div className="remote-participants">{remoteParticipants}</div>

        <div className="local-participant">
          {room ? (
            <Participant
              key={room.localParticipant.sid}
              participant={room.localParticipant}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Room;
