import React, { Component } from "react";
import "./css/Form.css";
import Input from "./Input";
import Button from "./Button";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import firebase from "../config/firebase.config";
import { db } from "../App";
class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      pattern: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        /^\w{6,}$/,
      ],
    };
    this.collectInfor = this.collectInfor.bind(this);
    this.add = this.add.bind(this);
    this.checkFormat = this.checkFormat.bind(this);
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
  collectInfor(e) {
    e.preventDefault();
    let value = e.target.value;
    this.setState({ [e.target.name]: value }); 
  }
  checkFormat() {
    if (
      !this.state.pattern[0].test(this.state.email) ||
      !this.state.pattern[1].test(this.state.username) ||
      !this.state.pattern[1].test(this.state.password) ||
      this.state.confirmpassword !== this.state.password
    ) {
      return false;
    }
    return true;
  }
  add(e) {
    let obj = this;
    e.preventDefault();
    if (obj.checkFormat()) {
      db.collection("users")
        .where("Username", "==", obj.state.username)
        .get()
        .then(function (querySnapshot) {
          return querySnapshot.empty;
        })
        .then((res) => {
          if (res) {
            db.collection("users")
              .add({
                Email: obj.state.email,
                Username: obj.state.username,
                Password: obj.state.password,
                Fullname: obj.state.fullname,
                Avatar: obj.state.avatarurl,
              })
              .then(function (docRef) {
                alert("Sign up successfully!");
                return docRef
                  .update({
                    ID: docRef.id,
                  })
                  .then(() => {
                    obj.setState({ id: docRef.id });
                  })
                  .catch(function (error) {
                    console.error("Error updating document: ", error);
                  });
              })
              .then(() => {
                db.collection("users")
                  .where("ID", "!=", obj.state.id)
                  .get()
                  .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                      let data = doc.data();
                      db.collection("chatrooms")
                        .add({
                          user1: data.ID,
                          user2: obj.state.id,
                          message: [],
                          modifiedDate: new Date(),
                        })
                        .then(function (docRef) {
                          docRef.update({
                            ID: docRef.id,
                          });
                        });
                    });
                  })
                  .then(() => {
                    obj.props.onExit();
                  })
                  .catch(function (error) {
                    console.log("Error getting documents: ", error);
                  });
              })
              .catch(function (error) {
                console.error("Error writing document: ", error.message);
              });
          } else {
            alert("This username has already existed!");
          }
        });
    } else {
      alert("Your informations are invalid!");
    }
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
          <h2>Sign Up</h2>
          <Input
            type="text"
            clear={this.props.status}
            onInput={this.collectInfor}
            label="Email"
            placeholder="abc@gmail.com"
          />
          <Input
            type="text"
            clear={this.props.status}
            onInput={this.collectInfor}
            label="Username"
            placeholder="Username (at least 6 characters)"
          />
          <Input
            type="password"
            clear={this.props.status}
            onInput={this.collectInfor}
            label="Password"
            placeholder="Password (at least 6 characters)"
          />
          <Input
            type="password"
            clear={this.props.status}
            onInput={this.collectInfor}
            label="Confirm password"
            placeholder="Confirm your password"
          />
          <Input
            type="text"
            clear={this.props.status}
            onInput={this.collectInfor}
            label="Fullname"
            placeholder="Fullname"
          />
          <Input
            type="text"
            clear={this.props.status}
            onInput={this.collectInfor}
            label="Avatar URL"
            placeholder="Paste your avatar URL"
          />
          <div className="container__btn">
            <Button onClick={this.add} className="btn">
              Sign Up
            </Button>
            <br />
            <p>
              You already have an account?
              <a onClick={this.props.move}> Login</a>
            </p>
          </div>
        </form>
      </div>
    );
  }
}

export default SignUp;
