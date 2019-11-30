import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { HashRouter as Router, Route } from "react-router-dom";

import App from "./App";
import About from "./pages/about";
import StoreProvider from "./Store";

ReactDOM.render(
  <StoreProvider>
    <Router>
      <div>
        <main>
          <Route exact path="/" component={App} />
          <Route path="/about" component={About} />
        </main>
      </div>
    </Router>
  </StoreProvider>,
  document.getElementById("root")
);
