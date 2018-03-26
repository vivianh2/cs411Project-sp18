import React, { Component } from "react";

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List from 'material-ui/List';
import Typography from 'material-ui/Typography';

import Item from './Item';

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background,
  },
  type: {
    margin: '2% 5%',
  }
});

class Results extends Component {
  state = {
    query: this.props.location.state.query,
    books: [],
    posts: [],
  }

  componentDidMount() {
    this.search(this.state.query)
      .then(res => {
          this.setState({
            books: res.books,
            posts: res.posts
          })
        }
      )
      .catch(err => console.log(err));
  }

  search = async query => {
    const response = await fetch("/api/search?q=" + query);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  render(){
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography className={classes.type} variant="headline" color="inherit">
          Search Results
        </Typography>
        <List>
          {this.state.books.map((book, i) =>
            <Item isbn={book.isbn} posts={this.state.posts[i]} key={book.isbn}/>
          )}
        </List>
      </div>
    );
  }
}

Results.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Results);
