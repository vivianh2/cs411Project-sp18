import React, { Component } from "react";
import { GoogleLogin } from "react-google-login";
import MyLogout from "./MyLogout";
import { withStyles } from 'material-ui/styles';
import Button from "material-ui/Button";
import { Link } from "react-router-dom";

// this component should handle
// 1. login and logout
// 2. once the user logs in, fetch their data from database, and the user will be redicrected to their profile page when clicking on their name/profile image/etc.
var pauth = sessionStorage.getItem("auth");
var pnetId = sessionStorage.getItem("netId");
var puserName = sessionStorage.getItem("userName");

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class Authentication extends Component {
  state = {
    auth: pauth == null ? 0 : pauth, // Yes or no
    netId: pnetId == null ? "unknown" : pnetId, // User netId
    userName: puserName == null ? "unknown" : puserName
  };

  constructor(props) {
    super(props);
    this.loginResponse = this.loginResponse.bind(this);
    this.logoutSuccess = this.logoutSuccess.bind(this);
  }

  async storeState() {
    sessionStorage.setItem("auth", this.state.auth);
    sessionStorage.setItem("netId", this.state.netId);
    sessionStorage.setItem("userName", this.state.userName);
  }

  async loginResponse(GoogleUser) {
    var email = GoogleUser.getBasicProfile().getEmail();
    var isStudent = email.endsWith("@illinois.edu");
    if (isStudent) {
      var atIndex = email.indexOf("@");
      var netId = email.substring(0, atIndex);
      var userName = GoogleUser.getBasicProfile().getName();
      this.setState({
        netId: netId,
        userName: userName,
        auth: 1
      });
      this.storeState();
    } else {
      alert("Please use UIUC email~");
    }
  }

  async logoutSuccess() {
    this.setState({
      netId: "unknow",
      userName: "unknow",
      auth: 0
    });
    this.storeState();
    alert("Logged out! We'll miss you~");
    sessionStorage.clear();
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    return (
      <div className="auth">
        {!this.state.auth ? (
          <GoogleLogin
            clientId="609372741285-p2k1ujp7bdbc5l05oc47102uvoc40qpb.apps.googleusercontent.com"
            buttonText={"Login with Google"}
            onSuccess={this.loginResponse}
          />
        ) : (
          <div>
            <Button
              component={({ ...props }) => <Link to="/account" {...props} />}
            >
              Account
            </Button>
            <MyLogout
              buttonText="Logout"
              onLogoutSuccess={this.logoutSuccess}
            />
          </div>
        )}
      </div>
    );
  }
}

export default  withStyles(styles)(Authentication);
