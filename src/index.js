import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from './Navigation';
import App from './components/App';
import Account from './components/Account'

ReactDOM.render((
  <Router>
    <div>
      <Navigation />
      <Route exact path="/" component={App}/>
      <Route path="/account" component={Account}/>
    </div>
  </Router>
), document.getElementById('root'));
registerServiceWorker();
