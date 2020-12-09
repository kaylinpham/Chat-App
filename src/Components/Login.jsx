import React, { Component } from "react";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import firebase from "../config/firebase.config";
import "./css/Form.css";
import Button from "./Button";
import Input from "./Input";
import Facebook from "./Facebook";
import { db } from "../App";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { url: "" };
  }
  componentDidMount() {
    const storageRef = firebase.storage().ref();
    let spaceRef = "iconfinder_error_1646012.png";
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
      <div className={this.props.status}>
        <img
          onClick={this.props.onExit}
          className="exit"
          src={this.state.url}
        />
        <form className="form__">
          <h2>Login</h2>
          <Input
            onInput={this.props.onInput}
            type="text"
            clear={this.props.status}
            label="Username"
            placeholder="Username"
          />
          <Input
            onInput={this.props.onInput}
            type="password"
            clear={this.props.status}
            label="Password"
            placeholder="Password"
          />
          <div className="container__btn">
            <Button onClick={this.props.onLogin} className="btn">
              Login
            </Button>
            <Facebook callback={this.props.onFB} />
            <br />
            <p>
              You don't have any account?{" "}
              <a onClick={this.props.move}> Sign up</a>
            </p>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
