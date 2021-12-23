import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Home from './Home';
import './App.css';

const NotFound = () => {
  return <h2>404 Not Found</h2>;
}

const App = () => {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg bg-dark" id='top'>
        <Link className="navbar-brand " to="/">
          <span className="mx-4 logo" >
            <i className="fab fa-gg-circle"></i>
          </span>
          Currency Exchange App
        </Link>
      </nav>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route component={NotFound} />
      </Switch>

      <footer className="text-center bg-dark text-muted">
        <div className="text-center p-4">
          <a className="text-reset fw-bold" href="https://adoring-johnson-bb1319.netlify.app/" target="_blank">Personal Portfolio
            <span id='portfolio'>
              <i className="far fa-address-card"></i>
            </span>
          </a>
        </div>
      </footer>

      <div className='position-fixed' id='fixed_button'>
        <a href='#top'>
          <button className='btn btn-dark'>
            <i class="far fa-arrow-alt-circle-up"></i>
            <span className='d-none d-md-inline'>&ensp;Top</span>
          </button>
        </a>
      </div>
    </Router>
  );
}
export default App;
