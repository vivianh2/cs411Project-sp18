import React, { Component } from 'react';
import './App.css';

import Search from './Search';

class App extends Component {
  state = {
    response: ''
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
      <div className="App">
        <div id="main">
          <p>Enter the book name, class name or ISBN to start search.</p>
          <Search searchable/>
        </div>
        <p className="App-intro">{this.state.response}</p>
      </div>
    );
  }
}

export default App;
