import React, { Component } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import MyLogout from './MyLogout'

// this component should handle
// 1. login and logout
// 2. once the user logs in, fetch their data from database, and the user will be redicrected to their profile page when clicking on their name/profile image/etc.
var pstatus = sessionStorage.getItem('status');
var pprompt = sessionStorage.getItem('prompt');
var pnetId = sessionStorage.getItem('netId');
var puserName = sessionStorage.getItem('userName');

class Authentication extends Component {

  state = {
      status: pstatus == null ? 0:pstatus, // Yes or no
      prompt: pprompt == null ? 'Google Login':pprompt,//'Google Login', // What to show on log bar
      netId: pnetId == null ? 'unknown':pnetId, // User netId
      userName: puserName == null ? 'unknown':puserName
  };

  constructor(){
    super();
    this.isLoggedIn = this.isLoggedIn.bind(this);
    this.loginResponse = this.loginResponse.bind(this);
    this.logoutSuccess = this.logoutSuccess.bind(this);
  }

  isLoggedIn(){
    return this.state.status;
  }

  async storeState(){
    sessionStorage.setItem('status', this.state.status);
    sessionStorage.setItem('prompt', this.state.prompt);
    sessionStorage.setItem('netId', this.state.netId);
    sessionStorage.setItem('userName', this.state.userName);
  }

  async loginResponse(GoogleUser) {
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
          this.storeState();
      }else{
          alert("Please use UIUC email~");
      }
  };

  async logoutSuccess() {
    this.setState(
      { prompt: 'Google Login',
        netId: 'unknow',
        userName: 'unknow',
        status: 0
      }
    );
    this.storeState();
    alert("Logged out! We'll miss you~");
    sessionStorage.clear();
  };

  render() {
    return (
      <div className="auth">
      { !this.isLoggedIn() ?
        <GoogleLogin
          clientId="609372741285-p2k1ujp7bdbc5l05oc47102uvoc40qpb.apps.googleusercontent.com"
          buttonText={this.state.prompt}
          onSuccess={this.loginResponse}
        />
        :
        <MyLogout
          buttonText={this.state.prompt}
          onLogoutSuccess={this.logoutSuccess}
        />
      }
      </div>
    );

  }
};


export default Authentication;
