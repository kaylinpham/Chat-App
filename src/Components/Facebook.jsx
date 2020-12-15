import React, { Component } from "react";
import FacebookLogin from "react-facebook-login";
class Facebook extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    auth: false,
    name: "",
    picture: "",
  };
  clicked() {
    // console.log("clicked");
  }
  render() {
    let FBdata;
    this.state.auth
      ? (FBdata = (
          <div>
            <img src={this.state.picture} alt={this.state.name} />
            <h2>Welcome {this.state.name}</h2>
          </div>
        ))
      : (FBdata = (
          <FacebookLogin
            appId="832074200961099"
            autoLoad={false}
            fields="name,email,picture"
            callback={this.props.callback}
            onClick={this.clicked}
            icon="fa-facebook"
            size="small"
            isDisabled={false}
          />
        ));
    return <>{FBdata}</>;
  }
}

export default Facebook;
