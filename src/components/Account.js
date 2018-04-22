import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import Grid from "material-ui/Grid";
import { MenuList, MenuItem } from "material-ui/Menu";
import { ListItemIcon, ListItemText } from "material-ui/List";
import AccountIcon from "material-ui-icons/AccountCircle";
import HistoryIcon from "material-ui-icons/History";
import ReactEcharts from 'echarts-for-react';

import Ratings from "./Ratings";
import History from "./History";

const styles = theme => ({
  menuItem: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& $primary, & $icon": {
        color: theme.palette.common.white
      }
    }
  },
  primary: {},
  icon: {},
  menu: {
    height: "100%",
  }
});

class Account extends Component {
  state = {
    netid: this.props.location.state.netid,
    username: this.props.location.state.username,
    rating: 0,
    option_prices: {},
    option_sold: {},
    option_bought: {},
    selectedItem: "account",
  };

  //this.state.option_data

  componentWillUnmount() {


  }


  componentDidMount() {
    this.getAccount(this.state.netid)
      .then(res =>
        this.setState({
          rating: res.rating
        })
      )
      .catch(err => console.log(err));

    // this.getPriceChart(this.state.netid)
    //   .then(res => {
    //     this.setState({
    //       option_prices: res.option
    //     })
    //     console.log("option_data is: " + this.state.option_data)
    //   }
    //   ).catch(err => console.log(err));
    
    this.getSoldChart(this.state.netid).then(res => {
      this.setState({
        option_sold: res.option
      })
      console.log("option_sold is: " + this.state.option_sold)
    }
    ).catch(err => console.log(err));

    this.getBoughtChart(this.state.netid).then(res => {
      this.setState({
        option_bought: res.option
      })
      console.log("option_bought is: " + this.state.option_bought)
    }
    ).catch(err => console.log(err));
  }

  getAccount = async netid => {
    const response = await fetch("/api/account?id=" + netid);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  getPriceChart = async netid => {
    const response = await fetch("/api/prices");
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };


  getSoldChart = async netid => {
    //const response = await fetch("/api/sold?id=" + netid);
    const response = await fetch("/api/sold");
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  getBoughtChart = async netid => {
    //const response = await fetch("/api/bought?id=" + netid);
    const response = await fetch("/api/bought");
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  menuClick = (value) => {
    this.setState({
      selectedItem: value,
    })
    console.log(this.state.selectedItem)
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid container justify="flex-start" >
        <Grid item md={2}>
          <MenuList className={classes.menu}>
            <MenuItem className={classes.menuItem} value="account" onClick={() => this.menuClick("account")}>
              <ListItemIcon className={classes.icon}>
                <AccountIcon />
              </ListItemIcon>
              <ListItemText
                classes={{ primary: classes.primary }}
                inset
                primary="Account"
              />
            </MenuItem>
            <MenuItem className={classes.menuItem} value="history" onClick={() => this.menuClick("history")}>
              <ListItemIcon className={classes.icon}>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText
                classes={{ primary: classes.primary }}
                inset
                primary="History"
              />
            </MenuItem>
          </MenuList>
        </Grid>
        <Grid item md={10}>
          {
            this.state.selectedItem === "account" &&
            (
              <React.Fragment>
                <Typography
                  variant="headline"
                  align="left"
                  color="inherit"
                  style={{ margin: "1% 2%" }}
                >
                  {this.state.username}
                </Typography>
                <Ratings rating={this.state.rating} />

                {/* <ReactEcharts
                  option={this.state.option_prices}
                  style={{ height: '300px' }}
                  opts={{ renderer: 'svg' }} // use svg to render the chart.
                /> */}

                <ReactEcharts
                  option={this.state.option_sold}
                  style={{ height: '400px' }}
                  opts={{ renderer: 'svg' }} // use svg to render the chart.
                />


                <ReactEcharts
                  option={this.state.option_bought}
                  style={{ height: '400px', padding: '25px' }}
                  opts={{ renderer: 'svg' }} // use svg to render the chart.
                />


              </React.Fragment>
            )
          }
          {
            this.state.selectedItem === "history" &&
            <History netid={this.state.netid} />
          }
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Account);
