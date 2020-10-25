import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import 'antd/dist/antd.css';

import PrivateRoute from './PrivateRoute';
import BaseContainer from './containers/BaseContainer';
import AuthContainer from './containers/AuthContainer';

function App() {

  return (
    <div id="container">
      <Router>
        <Switch>
          <Route path="/(auth)" component={AuthContainer} />
          <PrivateRoute component={BaseContainer} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
