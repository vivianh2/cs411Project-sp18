import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import yellow from "material-ui/colors/yellow";
import StarIcon from "material-ui-icons/Star";
import Typography from "material-ui/Typography";
import Rating from "react-rating";

const styles = theme => ({
  root: {
    display: "flex",
    justifyContent: "left",
    alignItems: "center"
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

function Ratings(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <Typography variant="body2">{props.text}</Typography>
      <Rating
        emptySymbol={<StarIcon className={classes.star_off} />}
        fullSymbol={<StarIcon className={classes.star_on} />}
        readonly
        initialRating={props.rating}
      />
      {props.rating === -1 && (
        <Typography variant="body1">Not enough rating</Typography>
      )}
    </div>
  );
}

Ratings.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Ratings);
