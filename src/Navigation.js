import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Authentication from './components/Authentication'

class Navigation extends Component {
  render(){
    return (
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/Account'>Account</Link></li>
        <li><Authentication /></li>
      </ul>
    );
  }
}

export default Navigation;
