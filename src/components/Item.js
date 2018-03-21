import React, { Component } from "react";
import Button from 'material-ui/Button';

class Item extends Component {

  render(){
    return (
      <p>{this.props.name}, {this.props.isbn}, {this.props.condition}, {this.props.price}, {this.props.seller}</p>
      <Button onClick={buy}>Buy</Button>
    );
  }
}

export default Item;
