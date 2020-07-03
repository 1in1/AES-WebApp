import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import TorTalk from './TorTalk.js';
import * as serviceWorker from './serviceWorker';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path='/tor' >
          <TorTalk />
        </Route>
        <Route path='/' >
          <App />
        </Route>
      </Switch>
      <footer>Clearnet: <a href='https://asg58.user.srcf.net'>asg58.user.srcf.net</a>. Tor: ca2m4yev3ofg5kt6ywbtzaf2cvlfg26ox5blwvfx6dbj4g3k2iczguqd.onion. <Link to='/tor' >What is this?</Link></footer>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
