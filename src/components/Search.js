import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';

import { Redirect } from 'react-router-dom';

let suggestions = [];

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;
  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
        },
        ...InputProps,
      }}
      {...other}
    />
  );
}

function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {suggestion.label}
    </MenuItem>
  );
}
renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired,
};

function getSuggestions(inputValue) {
  let count = 0;

  return suggestions.filter(suggestion => {
    const keep =
      (!inputValue || suggestion.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) &&
      count < 5;

    if (keep) {
      count += 1;
    }

    return keep;
  });
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: theme.spacing.unit,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
	button: {
		height: theme.spacing.unit,
		width: theme.spacing.unit,
		margin: "0 2%",
	}
});

class Search extends Component {
	state = {
    redirect: false,
		query: ''
  }

	componentDidMount() {
		this.getSuggestions()
			.then(res =>
				suggestions = res.suggestions
			)
			.catch(err => console.log(err));
	}

	getSuggestions = async () => {
		const response = await fetch("/api/suggestions");
		const body = await response.json();

		if (response.status !== 200) throw Error(body.message);
		return body;
	};

	handleChange = (selectedItem, downshiftState) => {
    this.setState({
			redirect: true,
			query: selectedItem
		});
  }

	renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect push to={{
							  pathname: '/results',
							  state: { query: this.state.query }
							}}/>
    }
  }

	render(){

	  const { classes } = this.props;
		return (
	    <div className={classes.root}>
				<Downshift onChange={this.handleChange}>
	        {({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex }) => (
	          <div className={classes.container}>
	            {renderInput({
	              fullWidth: true,
	              classes,
	              InputProps: getInputProps({
	                placeholder: 'Search a country (start with a)',
	                id: 'integration-downshift-simple',
	              }),
	            })}
	            {isOpen ? (
	              <Paper className={classes.paper} square>
	                {getSuggestions(inputValue).map((suggestion, index) =>
	                  renderSuggestion({
	                    suggestion,
	                    index,
	                    itemProps: getItemProps({ item: suggestion.label }),
	                    highlightedIndex,
	                    selectedItem,
	                  }),
	                )}
	              </Paper>
	            ) : null}
	          </div>
	        )}
	      </Downshift>
				{this.renderRedirect()}
	    </div>
	  );
	}
}

Search.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Search);
