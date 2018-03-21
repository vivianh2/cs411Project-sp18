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
  }
});

class Detail extends Component {
  state = {
    open: false,
    title: '',
    author: '',
    isbn: '',
    condition: '',
    seller: '',
    img: '',
    contact: '',
    price: '',
  };

  componentDidMount() {
    this.getTransaction(this.props.id)
      .then(res =>
        this.setState({
          condition: res.condition,
          seller: res.seller,
          img: res.img,
          contact: res.contact,
          price: res.price,
        })
      )
      .catch(err => console.log(err));

    this.getBook(this.props.isbn)
      .then(res =>
        this.setState({
          title: res.title,
          author: res.author
        })
      )
      .catch(err => console.log(err));
  }

  getTransaction = async id => {
    const response = await fetch("/api/transaction?id=" + id);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  getBook = async isbn => {
    const response = await fetch("/api/book?isbn=" + isbn);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    return body;
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
                <ListItemText inset primary={this.state.price} secondary={this.state.condition} />
              </Grid>
              <Grid item>
                <ListItemText inset primary={this.state.seller}/>
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
                  image={this.state.img}
                  title="Live from space album cover"
                />
                <div className={classes.details}>
                  <CardContent className={classes.content}>
                    <Typography variant="headline">{this.state.title}</Typography>
                    <Typography variant="subheading" color="textSecondary">
                      {this.state.author} <br/>
                      ISBN: {this.props.isbn}
                    </Typography>
                    <Divider/>
                    <Typography variant="body1">
                      Price: {this.state.price} <br/>
                      Seller: {this.state.seller} <br/>
                      Contact:
                    </Typography>
                    <Typography variant="body1" className={classes.contact}>
                      {this.state.contact}
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
  state = { list: false };

  handleClick = () => {
    this.setState({ list: !this.state.list });
  };

  render(){
    const { classes } = this.props;

    let posts;
    if (this.props.posts.length > 0){
      posts = this.props.posts.map((post, i) =>
        <Detail id={post.tid} isbn={this.props.book.isbn} key={i} classes={classes}/>
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
          {this.state.list ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.state.list} timeout="auto" unmountOnExit>
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
