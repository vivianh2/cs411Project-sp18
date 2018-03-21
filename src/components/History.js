import React, { Component } from "react";

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background,
  },
  type: {
    margin: '1% 2%',
  }
});

class History extends Component {
  state = {
    history: []
  }

  componentDidMount() {
    console.log(this.props.netid);
    this.getHistory(this.props.netid)
      .then(res =>
        this.setState({
          history: res.history
        })
      )
      .catch(err => console.log(err));
  }

  getHistory = async (netid) => {
    const response = await fetch("/api/history?id=" + netid);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  render(){
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography className={classes.type} variant="subheading" color="inherit">
          History
        </Typography>
        <List>
          {this.state.history.map((item, i) =>
            <ListItem key={i}>
              <ListItemText inset primary={item.title} />
            </ListItem>
          )}
        </List>
      </div>
    );
  }
}

History.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(History);
