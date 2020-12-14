import React, { Component } from "react";
import Avatar from "./Avatar";
import "./css/Profile.css";
import { imageExists } from "./Avatar";
const Profile = (props) => {
  return (
    <div className="profile">
      <div className="img__wrapper">
        <img
          id="profile__img"
          src={
            imageExists(props.data.Avatar)
              ? props.data.Avatar
              : "https://www.pphfoundation.ca/wp-content/uploads/2018/05/default-avatar.png"
          }
        />
        <p className="img__description">{props.data.Fullname}</p>
      </div>
      <span>
        <h2>Chat</h2>
      </span>
      <img
        onClick={() => {
          let choose = window.confirm("Do you want to log out?");
          if (choose) {
            window.localStorage.clear();
            window.location.reload();
          }
        }}
        id="logout_icon"
        src="./logout.png"
      />
    </div>
  );
};

export default Profile;
