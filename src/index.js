import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from './Navigation';
import App from './components/App';
import Account from './components/Account';
import Results from './components/Results';
import Post from './components/Post';

import CssBaseline from 'material-ui/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import blue from 'material-ui/colors/blue';

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
  typography: {
    htmlFontSize: 10,
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
        <Route path="/results" component={Results}/>
        <Route path="/post" component={Post}/>
      </MuiThemeProvider>
    </div>
  </Router>
), document.getElementById('root'));
registerServiceWorker();
