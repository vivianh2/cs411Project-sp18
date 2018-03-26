import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import MenuItem from 'material-ui/Menu/MenuItem';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';

const styles = theme => ({
  container: {
    width: '95%',
    margin: '0 2.5%',
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  menu: {
    width: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

const conditions = ['New', 'Like New', 'Good', 'Acceptable', 'Unacceptable'];
const currencies = [
  {
    value: 'USD',
    label: '$',
  },
  // {
  //   value: 'CNY',
  //   label: '¥',
  // },
];

class Post extends React.Component {
  state = {
    isbn: '',
    condition: '',
    price: '',
    contact: '',
    currency: '',
  };
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  postData(url, data) {
    // Default options are marked with *
    return fetch(url, {
      body: JSON.stringify(data), // must match 'Content-Type' header
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, same-origin, *omit
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      redirect: 'follow', // *manual, follow, error
      referrer: 'no-referrer', // *client, no-referrer
    })
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleSubmit(event) {
    console.log(this.state);
    this.postData('/api/create', {
      isbn: this.state.isbn,
      condition: this.state.condition,
      price: this.state.price,
      contact: this.state.contact,
      currency: this.state.currency
    })
      .then(response => {
        if (response.ok){
          alert("Your post has been received.");
        } else {
          alert(response.status + " " + response.statusText);
        }
      })
    event.preventDefault();
  }

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.container} noValidate autoComplete="off" onSubmit={this.handleSubmit}>
        <TextField
          id="isbn"
          required
          label="ISBN"
          className={classes.textField}
          value={this.state.isbn}
          onChange={this.handleChange('isbn')}
          margin="normal"
          fullWidth
        />
        <TextField
          id="select-condition"
          required
          select
          label="Condition"
          className={classes.textField}
          value={this.state.condition}
          onChange={this.handleChange('condition')}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          helperText="Please select book condition"
          margin="normal"
        >
          {conditions.map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="select-currency"
          required
          select
          label="Currency"
          className={classes.textField}
          value={this.state.currency}
          onChange={this.handleChange('currency')}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          helperText="Please select your currency"
          margin="normal"
        >
          {currencies.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label} {option.value}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="price"
          required
          label="Price"
          className={classes.textField}
          value={this.state.price}
          onChange={this.handleChange('price')}
          margin="normal"
          type="number"
        />
        <TextField
          id="contact"
          required
          label="Contact information"
          className={classes.textField}
          value={this.state.contact}
          onChange={this.handleChange('contact')}
          margin="normal"
          fullWidth
          placeholder="Messenger/ Wechat: ****"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Grid container justify='flex-end'>
          <label>
            <Button component="span" className={classes.button}>
              Upload product image
            </Button>
            <input
              accept="image/*"
              type="file"
              style={{display: 'none'}}
              ref={input => {
                this.fileInput = input;
              }}
            />
          </label>
          <Button variant="raised" color="primary" className={classes.button} type="submit" value="submit">
            Confirm
          </Button>
        </Grid>
      </form>
    );
  }
}

Post.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Post);
