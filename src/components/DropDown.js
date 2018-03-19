import React, {
  Component
} from 'react';
import './App.css';
import {
  render
} from 'react-dom';
import 'semantic-ui-css/semantic.min.css'
import {
  Button,
  Icon,
  Image as ImageComponent,
  Item,
  Label,
  Grid,
  Segment
} from 'semantic-ui-react'



class App extends Component {
  //the input is an array of bookname
  ret = arr.map((book, index) => {
    return (
      <Grid.Column>
      <Item key = {index}>
      <Item.Content>
         <Item.Meta>{book.name}</Item.Meta>
      </Item.Content>
    </Item>
    </Grid.Column>
    )
  });

  render() {
    return (
      <Grid.Column>
        <Item.Group>
          {this.ret}
        </Item.Group>
      </Grid.Column>
    );
  }
}

export default App;