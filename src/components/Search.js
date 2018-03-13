import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Icon from 'material-ui/Icon';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  textField: {
    flexBasis: 200,
  },
});

class Search extends React.Component {
  state = {
    name: ''
  };

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <FormControl fullWidth className={classes.margin}>
          <Input
            id="adornment-name"
            placeholder="CS 125"
            value={this.state.name}
            onChange={this.handleChange('name')}
            startAdornment={<InputAdornment position="start"><Icon>search</Icon></InputAdornment>}
          />
        </FormControl>
      </div>
    );
  }
}

Search.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Search);
