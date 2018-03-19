import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from './Navigation';
import App from './components/App';
import Account from './components/Account'

import CssBaseline from 'material-ui/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import blue from 'material-ui/colors/blue';

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

ReactDOM.render((
  <Router>
    <div>
      <CssBaseline />
      <MuiThemeProvider theme={theme}>
        <Navigation />
        <Route exact path="/" component={App}/>
        <Route path="/account" component={Account}/>
      </MuiThemeProvider>
    </div>
  </Router>
), document.getElementById('root'));
registerServiceWorker();
