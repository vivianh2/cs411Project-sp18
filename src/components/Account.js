import React, { Component } from 'react';

class Account extends Component {
  state = {
    rating: -1
  };

  constructor(props){
    super(props);
  };

  componentDidMount() {
    this.getAccount(this.props.netid)
      .then(res => this.setState(
        {
          rating: res.rating
        }))
      .catch(err => console.log(err));
  }

  getAccount = async (netid) => {
    const response = await fetch('/api/account?id=' + netid);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render(){
    return (
      <p>Account</p>
    );
  }
};

export default Account;
