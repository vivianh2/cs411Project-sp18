import React, { Component } from 'react';
import './App.css';

import Search from './Search';

class App extends Component {

  render() {
    return (
      <div className="App">
        <div id="main">
          <p>Enter the book name, class name or ISBN to start search.</p>
          <Search/>
        </div>
      </div>
    );
  }
}

export default App;
