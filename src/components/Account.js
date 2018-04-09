import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import { MenuList, MenuItem } from "material-ui/Menu";
import { ListItemIcon, ListItemText } from "material-ui/List";
import AccountIcon from "material-ui-icons/AccountCircle";

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
    rating: 0
  };

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
    return body;
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid container justify="flex-start" alignItems="center">
        <Grid item xs={12}>
          <Typography
            variant="headline"
            align="left"
            color="inherit"
            style={{ margin: "1% 2%" }}
          >
            {this.state.username}
          </Typography>
          <Ratings rating={this.state.rating} />
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <MenuList className={classes.menu}>
              <MenuItem className={classes.menuItem}>
                <ListItemIcon className={classes.icon}>
                  <AccountIcon />
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.primary }}
                  inset
                  primary="Account"
                />
              </MenuItem>
              <MenuItem className={classes.menuItem}>
                <ListItemIcon className={classes.icon}>
                  <AccountIcon />
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.primary }}
                  inset
                  primary="History"
                />
              </MenuItem>
            </MenuList>
          </Paper>
          <History netid={this.state.netid} />
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Account);
