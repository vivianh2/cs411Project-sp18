import React, { Component } from "react";
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Ratings from './Ratings';
import History from './History'

class Account extends Component {
  state = {
    netid: this.props.location.state.netid,
    username: this.props.location.state.username,
    rating: 0
  }

  componentDidMount() {
    this.getAccount(this.state.netid)
      .then(res =>
        this.setState({
          rating: res.rating
        })
      )
      .catch(err => console.log(err));
  }

  getAccount = async netid => {
    const response = await fetch("/api/account?id=" + netid);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    console.log(body);
    return body;
  };

  render() {
    return (
      <Grid container justify="flex-start" alignItems="center">
        <Typography variant="headline" align='left' color="inherit"  style={{ margin: "1% 2%" }}>
          {this.state.username}
        </Typography>
        <Ratings rating={this.state.rating} />
        <History netid={this.state.netid} />
      </Grid>
    );
  }
}

export default Account;
