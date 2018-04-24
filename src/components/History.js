import React, { Component } from "react";

import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import Table, {
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow
} from "material-ui/Table";
import Popover from "material-ui/Popover";

import IconButton from "material-ui/IconButton";
import FirstPageIcon from "material-ui-icons/FirstPage";
import EditIcon from "material-ui-icons/Edit";
import DeleteIcon from "material-ui-icons/Delete";
import KeyboardArrowLeft from "material-ui-icons/KeyboardArrowLeft";
import KeyboardArrowRight from "material-ui-icons/KeyboardArrowRight";
import LastPageIcon from "material-ui-icons/LastPage";
import Modal from "material-ui/Modal";
import TextField from "material-ui/TextField";

import Rating from "react-rating";
import yellow from "material-ui/colors/yellow";
import StarIcon from "material-ui-icons/Star";

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5
  }
});

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, {
  withTheme: true
})(TablePaginationActions);

const styles = theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background
  },
  table: {
    minWidth: 500
  },
  tableWrapper: {
    overflowX: "auto",
    width: "95%",
    margin: "0 2.5%"
  },
  paper: {
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    margin: "10% 25%"
  },
  update: {
    float: "right"
  },
  star_on: {
    margin: theme.spacing.unit,
    color: yellow[500]
  },
  star_off: {
    margin: theme.spacing.unit,
    color: "#9E9E9E"
  }
});

class History extends Component {
  state = {
    history: [],
    page: 0,
    rowsPerPage: 5,
    open: false,
    price: -1,
    buyer: null,
    id: -1,
    ratingOpen: false,
    rating: 0
  };

  componentDidMount() {
    this.getHistory(this.props.netid)
      .then(res =>
        this.setState({
          history: res.history.map((item, index) => {
            item.id = index;
            return item;
          })
        })
      )
      .catch(err => console.log(err));
  }

  getHistory = async netid => {
    const response = await fetch("/api/history?id=" + netid);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleOpen = (price, id) => {
    this.setState({
      open: true,
      price: price,
      buyer: "",
      id: id
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
      price: -1,
      buyer: "",
      id: -1
    });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleRatingOpen = id => {
    this.setState({
      ratingOpen: true,
      rating: 0,
      id: id
    });
  };

  handleRatingClose = () => {
    console.log(this.state.rating)
    console.log(this.state.id)
    let that = this;
    this.rate(this.state.id, function () {
      that.setState({
        ratingOpen: false,
        rating: 0,
        id: -1
      });
    })
  };

  postData(url, data) {
    // Default options are marked with *
    return fetch(url, {
      body: JSON.stringify(data), // must match 'Content-Type' header
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, same-origin, *omit
      headers: {
        "content-type": "application/json"
      },
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      redirect: "follow", // *manual, follow, error
      referrer: "no-referrer" // *client, no-referrer
    });
  }

  received = id => {
    console.log("received " + id);
    this.postData("/api/received", { tid: this.state.history[id].tid }).then(
      response => {
        if (response.ok) {
          response.json().then(result => {
            let history = this.state.history;
            history[id].sell_time = result.sell_time;
            this.setState({
              history: history
            });
          });
        }
      }
    );
  };

  delete = id => {
    console.log("delete " + id);
    this.postData("/api/delete", { tid: this.state.history[id].tid }).then(
      response => {
        if (response.ok) {
          let history = this.state.history;
          history.splice(id, 1);
          this.setState({
            history: history.map((item, index) => {
              item.id = index;
              return item;
            })
          });
        }
      }
    );
  };

  update = id => {
    console.log("update " + id);
    let that = this;
    this.postData("/api/update", {
      tid: this.state.history[id].tid,
      price: this.state.price,
      buyer: this.state.buyer
    }).then(response => {
      if (response.ok) {
        response.json().then(result => {
          let history = this.state.history;
          history[id].price = result.price;
          history[id].buyerid = result.buyer;
          console.log(history);
          this.setState({
            history: history
          });
          that.handleClose();
        });
      } else {
        alert(response.status + " " + response.statusText);
      }
    });
  };

  rate = (id, callback) => {
    console.log("rate " + id);
    let that = this;
    let url;
    if (this.props.netid === this.state.history[id].sellerid) {
      url = "/api/rate/buyer";
    } else {
      url = "/api/rate/seller";
    }
    this.postData(url, {
      tid: this.state.history[id].tid,
      rating: this.state.rating
    }).then(response => {
      if (response.ok) {
        response.json().then(result => {
          let history = this.state.history;
          history[id].buyer_rating = result.buyer_rating;
          history[id].seller_rating = result.seller_rating;
          console.log(history);
          this.setState({
            history: history
          });
          alert("rating received")
          callback()
        });
      } else {
        alert(response.status + " " + response.statusText);
        callback()
      }
    });
  };

  render() {
    const { classes } = this.props;
    const { history, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, history.length - page * rowsPerPage);
    return (
      <div className={classes.root}>
        <Typography variant="headline" color="inherit">
          History
        </Typography>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Buyer</TableCell>
                <TableCell>Seller</TableCell>
                <TableCell>Post time</TableCell>
                <TableCell>Sell time</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  return (
                    <TableRow key={n.id}>
                      <TableCell>{n.name}</TableCell>
                      <TableCell>{n.buyerid}</TableCell>
                      <TableCell>{n.sellerid}</TableCell>
                      <TableCell>{n.post_time}</TableCell>
                      <TableCell>
                        {n.sell_time || n.sellerid === this.props.netid ? (
                          n.sell_time
                        ) : (
                          <Button
                            variant="raised"
                            color="primary"
                            className={classes.button}
                            onClick={() => this.received(n.id)}
                          >
                            Item received
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          className={classes.button}
                          aria-label="Edit"
                          disabled={
                            !(
                              n.sellerid === this.props.netid &&
                              n.buyerid === null
                            )
                          }
                          onClick={() => this.handleOpen(n.price, n.id)}
                        >
                          <EditIcon />
                        </IconButton>
                        <Modal
                          aria-labelledby="simple-modal-title"
                          aria-describedby="simple-modal-description"
                          open={this.state.open}
                          onClose={this.handleClose}
                        >
                          <div className={classes.paper}>
                            <Typography variant="title" id="modal-title">
                              Update buyer and/or price information
                            </Typography>
                            <TextField
                              id="buyer"
                              label="buyer"
                              placeholder="Enter buyer netid"
                              className={classes.textField}
                              margin="normal"
                              value={this.state.buyer}
                              onChange={this.handleChange("buyer")}
                            />
                            <br />
                            <TextField
                              id="price"
                              label="price"
                              className={classes.textField}
                              margin="normal"
                              value={this.state.price}
                              onChange={this.handleChange("price")}
                            />
                            <br />
                            <Button
                              color="primary"
                              className={classes.update}
                              onClick={() => this.update(this.state.id)}
                            >
                              Update
                            </Button>
                          </div>
                        </Modal>
                        <IconButton
                          color="primary"
                          className={classes.button}
                          aria-label="Delete"
                          disabled={
                            !(n.buyerid === null || n.buyerid === undefined)
                          }
                          onClick={() => this.delete(n.id)}
                        >
                          <DeleteIcon />
                        </IconButton>

                        <IconButton
                          className={classes.button}
                          aria-label="Rate"
                          color="primary"
                          disabled={
                            !(
                              (this.props.netid === n.buyerid &&
                                n.seller_rating === null) ||
                              (this.props.netid === n.sellerid &&
                                n.buyer_rating === null &&
                                n.buyerid !== null)
                            )
                          }
                          onClick={() => this.handleRatingOpen(n.id)}
                        >
                          <StarIcon />
                        </IconButton>
                        <Popover
                          open={this.state.ratingOpen}
                          onClose={this.handleRatingClose}
                          anchorEl={this.anchorEl}
                          anchorReference="anchorEl"
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "right"
                          }}
                        >
                          <Rating
                            {...this.props}
                            emptySymbol={
                              <StarIcon className={classes.star_off} />
                            }
                            fullSymbol={
                              <StarIcon className={classes.star_on} />
                            }
                            initialRating={this.state.rating}
                            onChange={(rate) => this.setState({ rating: rate })}
                          />
                        </Popover>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 48 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={3}
                  count={history.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  Actions={TablePaginationActionsWrapped}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    );
  }
}

History.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(History);
