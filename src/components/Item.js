import React, { Component } from "react";

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import Collapse from 'material-ui/transitions/Collapse';
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import Snackbar from 'material-ui/Snackbar';

const isbn = require('node-isbn');

const styles = theme => ({
  root: {
    width: '90%',
    margin: '0 5%',
    backgroundColor: theme.palette.background,
  },
  nested: {
    paddingLeft: '5%',
  },
  button: {
    margin: theme.spacing.unit,
    width: theme.spacing.unit,
  },
  card: {
    width: '80%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    margin: '5% 10%',
    display: 'flex'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: '40%',
    height: '100%',
  },
  contact: {
    paddingLeft: theme.spacing.unit * 2,
  },
  divider: {
    margin: '5% 0',
  }
});

class Detail extends Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
          <ListItem button className={classes.nested}>
            <Grid container>
              <Grid item xs={3}>
                <ListItemText inset primary={this.props.post.price} secondary={this.props.post.condition} />
              </Grid>
              <Grid item>
                <ListItemText inset primary={this.props.post.sellerid}/>
              </Grid>
            </Grid>
            <ListItemSecondaryAction>
              <Button variant="raised" color="primary" className={classes.button} onClick={this.handleOpen}>
                Detail
              </Button>
              <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.open}
                onClose={this.handleClose}
              >
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cover}
                  image={this.props.post.img}
                  title="Item detail"
                />
                <div className={classes.details}>
                  <CardContent className={classes.content}>
                    <Typography variant="headline">{this.props.book.title}</Typography>
                    <Typography variant="subheading" color="textSecondary">
                      {this.props.book.authors && this.props.book.authors.join(', ')} <br/>
                    ISBN: {this.props.book.isbn}
                    </Typography>
                    <Divider className={classes.divider}/>
                    <Typography variant="body1">
                      Price: {this.props.post.price} <br/>
                    Seller: {this.props.post.sellerid} <br/>
                      Contact:
                    </Typography>
                    <Typography variant="body1" className={classes.contact}>
                      {this.props.post.contact}
                    </Typography>
                  </CardContent>
                </div>
              </Card>
              </Modal>
            </ListItemSecondaryAction>
          </ListItem>
    );
  }
}

Detail.propTypes = {
  classes: PropTypes.object.isRequired,
};

class Item extends Component {
  state = {
    open: false,
    book: {}
  };

  componentDidMount () {
    let that = this;
    this.setState({
      book: {
        isbn: this.props.isbn,
      }
    });
    console.log(this.props);

    isbn.resolve(this.props.isbn, function (err, book) {
      if (err) {
        console.log('Book not found', err);
      } else {
        book.isbn = that.props.isbn;
        that.setState({ book: book })
        console.log('Book found %j', book);
      }
    });
  }

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  render(){
    const { classes } = this.props;

    let posts;
    if (this.props.posts.length > 0){
      posts = this.props.posts.map((post, i) =>
        <Detail book={this.state.book} post={post} key={i} classes={classes}/>
      )
    } else{
      posts = <ListItem className={classes.nested}>
                <ListItemText inset primary='No result on this item.'/>
              </ListItem>
    }

    return (
      <div className={classes.root}>
        <ListItem button onClick={this.handleClick}>
          <ListItemText primary={this.state.book.title} secondary={this.props.isbn}/>
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

Item.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Item);
