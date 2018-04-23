import React, { Component } from 'react';
import './App.css';

import Search from './Search';
import Trend from "./Trend";

class App extends Component {

  render() {
    return (
      <div className="App">
        <div id="main">
          <p>Enter the <del>book name,</del> class name or ISBN to start search.</p>
          <Search/>
        </div>
        <Trend netid="haonan3" />
      </div>
    );
  }
}

export default App;
