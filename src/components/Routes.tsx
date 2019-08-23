import * as React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import { BIP70 } from "./BIP70";
import { Init } from "./Init";
import { Invoice } from "./Invoice";

function Routes() {
  return (
    <Router>
      <Route exact path="/" component={Init} />
      <Route path="/invoice" component={Invoice} />
      <Route path="/request" component={BIP70} />
    </Router>
  );
}

export default Routes;
