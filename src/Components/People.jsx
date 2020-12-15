import React from "react";
import Person from "./Person";
import "./css/People.css";
const People = (props) => {
  const rooms = props.data;
  const friends = props.friends;
  const owner = props.owner;
  let person = [];
  rooms.map((room) => {
    friends.map((friend) => {
      if (
        friend.ID === room.user1 ||
        friend.ID === room.user2
      ) {
        person.push(
          <Person
            className={
              room.ID === props.roomID ? "personal active" : "personal"
            }
            onActive={props.onActive}
            room={room}
            friend={friend}
            owner={owner}
          />
        );
      }
    });
  });
  return <div className="people">{person}</div>;
};

export default People;
