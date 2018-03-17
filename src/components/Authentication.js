import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import { GoogleLogout } from 'react-google-login';

// this component should handle
// 1. login and logout
// 2. once the user logs in, fetch their data from database, and the user will be redicrected to their profile page when clicking on their name/profile image/etc.

class Authentication extends Component {
  state = {
    loginStatus: 'no', // Yes or no
    logbarWord: 'Google Login', // What to show on log bar
    netId: 'unknow', // User netId
    userName: 'unknow'
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  render() {
    const loginResponse = (GoogleUser) => {
        var email = GoogleUser.getBasicProfile().getEmail();
        var isStudent = email.endsWith('@illinois.edu')
        if(isStudent == true){
            var atIndex = email.indexOf('@');
            var netId = email.substring(0, atIndex);
            var userName = GoogleUser.getBasicProfile().getName();
            this.setState(
              { logbarWord: 'Log out ' + userName,
                netId: netId,
                userName: userName,
                loginStatus: 'yes'
              }
            );
        }else{
            alert("Please use UIUC email~");
        }
    };

    const logoutResponse = (GoogleUser) => {
      this.setState(
        { logbarWord: 'Google Login',
          netId:'unknow',
          userName: 'unknow',
          loginStatus: 'no'
        }
      );
      alert("Logged out! We'll miss you~");
    };

    if(this.state.loginStatus == 'no'){
      return (
        <div>
          <GoogleLogin
            clientId="609372741285-p2k1ujp7bdbc5l05oc47102uvoc40qpb.apps.googleusercontent.com"
            buttonText={this.state.logbarWord}
            onSuccess={loginResponse}
            onFailure={loginResponse}
          />
        </div>
      );
    }
    return (
        <div>
        <GoogleLogout
          buttonText="Logout"
          onLogoutSuccess={logoutResponse}
        >
        </GoogleLogout>
      </div>
    );

  }
};


export default Authentication;
