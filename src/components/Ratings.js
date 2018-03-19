import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import yellow from 'material-ui/colors/yellow';
import Icon from 'material-ui/Icon';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'flex-end',
  },
  star_on: {
    margin: theme.spacing.unit,
    color: yellow[500],
  },
  star_off: {
    margin: theme.spacing.unit,
    color: '#9E9E9E',
  }
});

function Ratings(props) {
  const { classes } = props;
  const arr = [...Array(5).keys()];
  const stars = arr.map(i => {
    let name = (i < props.rating ? classes.star_on : classes.star_off);
    return <Icon className={name} key={i}>star</Icon>
  });

  return (
    <div className={classes.root}>
      {stars}
    </div>
  );
}

Ratings.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Ratings);
