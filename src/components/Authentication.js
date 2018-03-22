import React, { Component } from "react";
import { GoogleLogin } from "react-google-login";
import MyLogout from "./MyLogout";
import Button from "material-ui/Button";
import { Link } from "react-router-dom";

// this component should handle
// 1. login and logout
// 2. once the user logs in, fetch their data from database, and the user will be redicrected to their profile page when clicking on their name/profile image/etc.
var pauth = sessionStorage.getItem("auth");
var pnetid = sessionStorage.getItem("netid");
var puserName = sessionStorage.getItem("userName");

class Authentication extends Component {
  state = {
    auth: pauth == null ? 0 : pauth, // Yes or no
    netid: pnetid == null ? '' : pnetid, // User netid
    userName: puserName == null ? '' : puserName
  };

  constructor(props) {
    super(props);
    this.loginResponse = this.loginResponse.bind(this);
    this.logoutSuccess = this.logoutSuccess.bind(this);
  }

  async storeState() {
    sessionStorage.setItem("auth", this.state.auth);
    sessionStorage.setItem("netid", this.state.netid);
    sessionStorage.setItem("userName", this.state.userName);
  }

  postData(url, data) {
    // Default options are marked with *
    return fetch(url, {
      body: JSON.stringify(data), // must match 'Content-Type' header
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, same-origin, *omit
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      redirect: 'follow', // *manual, follow, error
      referrer: 'no-referrer', // *client, no-referrer
    })
  }

  async loginResponse(GoogleUser) {
    var email = GoogleUser.getBasicProfile().getEmail();
    var isStudent = email.endsWith("@illinois.edu");
    if (isStudent) {
      var atIndex = email.indexOf("@");
      var netid = email.substring(0, atIndex);
      var userName = GoogleUser.getBasicProfile().getName();
      this.setState({
        netid: netid,
        userName: userName,
        auth: 1
      });
      this.storeState();

      this.postData('/api/login', {netid: netid})
        .catch(error => console.error(error));
    } else {
      alert("Please use UIUC email~");
    }
  }

  async logoutSuccess() {
    this.setState({
      netid: '',
      userName: '',
      auth: 0
    });
    this.storeState();
    alert("Logged out! We'll miss you~");
    sessionStorage.clear();
    this.postData('/api/logout', {netid: ''})
      .catch(error => console.error(error));
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
            <Button color='inherit'
              component={({ ...props }) => (
                <Link
                  to={{
                    pathname: "/account",
                    state: { netid: this.state.netid, username: this.state.userName }
                  }}
                  {...props}
                />
              )}
            >
              Account
            </Button>
            <Link to='/'><MyLogout
              buttonText="Logout"
              onLogoutSuccess={this.logoutSuccess}
            ></MyLogout></Link>
          </div>
        )}
      </div>
    );
  }
}

export default Authentication;
