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
    option: {},
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

      this.getChartData(this.state.netid)
      .then(res => {
        this.setState({
          option: res.option
        })
        console.log("normp is: " + this.state.option_data)
      }
      ).catch(err => console.log(err));
  }

  getAccount = async netid => {
    const response = await fetch("/api/account?id=" + netid);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  getChartData = async netid => {
    const response = await fetch("/api/prices");
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

                <ReactEcharts
                  option={this.state.option}
                  style={{ height: '300px' }}
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
