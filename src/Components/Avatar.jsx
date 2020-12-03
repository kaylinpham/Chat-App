import React, { Component } from "react";
import "./css/Avatar.css";
const Avatar = (props) => {
  const urlDefault =
    "https://www.pphfoundation.ca/wp-content/uploads/2018/05/default-avatar.png";
  return (
    <div className="avt">
      <img src={imageExists(props.url) ? props.url : urlDefault} />
    </div>
  );
};

export default Avatar;
export function imageExists(url) {
  var image = new Image();

  image.src = url;

  if (!image.complete) {
    return false;
  } else if (image.height === 0) {
    return false;
  }
  return true;
}
