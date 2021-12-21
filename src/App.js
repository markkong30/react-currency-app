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
      <nav className="navbar navbar-expand-lg bg-dark">
        <Link className="navbar-brand " to="/">
          <span className="mx-4" style={{fontSize: 30, color: 'white'}}>
          <i class="fab fa-gg-circle"></i>
          </span>
          Currency Exchange App
        </Link>
      </nav>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}
export default App;
