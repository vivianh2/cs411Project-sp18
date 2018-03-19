import React from "react";
import PropTypes from "prop-types";
import {
  withStyles
} from "material-ui/styles";
import Card, {
  CardActions,
  CardContent,
  CardMedia
} from "material-ui/Card";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import {
  Grid,
  Paper
} from "material-ui";
import Itemlist from "./ItemList";
import Autolist from "./AutoList";
import SellerDetail from "./SellerDetail";
import BookDetail from "./BookDetail";

const styles = {
  card: {
    maxWidth: 345,
    width: "50%",
    margin: "0 auto"
  },
  media: {
    height: 200
  }
};

function SimpleMediaCard(props) {
  //Two Card
  const {
    classes
  } = props;
  return (
    <Grid container>
      <Grid item sm>
        <Card className={classes.card}>
          <BookDetail />
        </Card>
      </Grid>

      <Grid item sm>
        <Paper>
          <Card className={classes.card}>
            <SellerDetail />
          </Card>
        </Paper>
      </Grid>
    </Grid>
  );
}

SimpleMediaCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleMediaCard);