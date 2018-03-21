import React, { Component } from "react";

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import Collapse from 'material-ui/transitions/Collapse';
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';
import Button from 'material-ui/Button';

const styles = theme => ({
  root: {
    width: '90%',
    margin: '1% 5%',
    backgroundColor: theme.palette.background,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
  button: {
    margin: theme.spacing.unit,
    width: theme.spacing.unit,
  },
});

class Item extends Component {
  state = { open: false };

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  render(){
    const { classes } = this.props;

    let posts;
    if (this.props.posts.length > 0){
      posts = this.props.posts.map((post, i) =>
        <ListItem button className={classes.nested} key={i}>
          <ListItemText inset primary={post.price} secondary={post.condition} />
          <ListItemSecondaryAction>
            <Button variant="raised" color="primary" className={classes.button}>
              Buy
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      )
    } else{
      posts = <ListItem className={classes.nested}>
                <ListItemText inset primary='No result on this item.'/>
              </ListItem>
    }

    return (
      <div className={classes.root}>
        <ListItem button onClick={this.handleClick}>
          <ListItemText primary={this.props.book.title} secondary={this.props.book.isbn}/>
          {this.state.open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            { posts }
          </List>
        </Collapse>
      </div>
    );
  }
}
//


Item.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Item);
