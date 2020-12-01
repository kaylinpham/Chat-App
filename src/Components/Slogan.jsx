import React, { Component } from "react";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import firebase from "../config/firebase.config";
import "./css/Slogan.css";
import Button from "./Button";
import Login from "./Login";
class Slogan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
    };
  }
  componentDidMount() {
    const storageRef = firebase.storage().ref();
    let spaceRef = "austin-distel-DS1hZ4xzD7M-unsplash.jpg";
    storageRef
      .child(spaceRef)
      .getDownloadURL()
      .then((url) => {
        this.setState({ url: url });
      })
      .catch((err) => console.log(err));
  }
  render() {
    return (
      <div className={this.props.className}>
        <div className="slogan__container">
          <img src={this.state.url} />
          <div className="slogan">
            <h1 className="title pdl5__boxbd">Chat App</h1>
            <p className="quote pdl5__boxbd">
              “We are partners by fate - We become friends by choice”
            </p>
            <div className="btns__container pdl5__boxbd">
              <Button onClick={this.props.onLogin} className="slogan__btn">
                LOGIN
              </Button>
              <Button onClick={this.props.onSignup} className="slogan__btn">
                SIGN UP
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Slogan;
