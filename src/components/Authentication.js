import React, { Component } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';

// this component should handle
// 1. login and logout
// 2. once the user logs in, fetch their data from database, and the user will be redicrected to their profile page when clicking on their name/profile image/etc.

class Authentication extends Component {
  state = {
    status: 0, // Yes or no
    prompt: 'Google Login', // What to show on log bar
    netId: 'unknown', // User netId
    userName: 'unknown'
  };

  constructor(){
    super();
    this.isLoggedIn = this.isLoggedIn.bind(this);
    this.loginResponse = this.loginResponse.bind(this);
    this.logoutResponse = this.logoutResponse.bind(this);
  }

  isLoggedIn(){
    return this.state.status;
  }

  loginResponse(GoogleUser) {
      var email = GoogleUser.getBasicProfile().getEmail();
      var isStudent = email.endsWith('@illinois.edu')
      if(isStudent){
          var atIndex = email.indexOf('@');
          var netId = email.substring(0, atIndex);
          var userName = GoogleUser.getBasicProfile().getName();
          this.setState(
            { prompt: 'Log out ' + userName,
              netId: netId,
              userName: userName,
              status: 1
            }
          );
      }else{
          alert("Please use UIUC email~");
      }
  };

  logoutResponse(GoogleUser) {
    this.setState(
      {
        status: 0,
        prompt: 'Google Login',
        netId: 'unknown',
        userName: 'unknown'
      }
    );
    alert("Logged out! We'll miss you~");
  };

  render() {
    return (
      <div className="auth">
      { !this.isLoggedIn() ?
        <GoogleLogin
          clientId="609372741285-p2k1ujp7bdbc5l05oc47102uvoc40qpb.apps.googleusercontent.com"
          buttonText={this.state.prompt}
          onSuccess={this.loginResponse}
          onFailure={this.loginResponse}
        />
        :
        <GoogleLogout
          buttonText={this.state.prompt}
          onLogoutSuccess={this.logoutResponse}
        />
      }
      </div>
    );

  }
};


export default Authentication;
