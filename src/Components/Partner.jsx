import React, { Component } from "react";
import "./css/Partner.css";
import { imageExists } from "./Avatar";
const Partner = (props) => {
  const urlDefault =
    "https://www.pphfoundation.ca/wp-content/uploads/2018/05/default-avatar.png";
  return (
    <div className="partner__profile">
      <div className="partner__img-container">
        <img
          className="partner__img"
          src={
            imageExists(props.guest.Avatar) ? props.guest.Avatar : urlDefault
          }
        />
      </div>
      <div className="partner__details">
        <p>
          <b>{props.guest.Fullname}</b>
        </p>
      </div>
    </div>
  );
};

export default Partner;
