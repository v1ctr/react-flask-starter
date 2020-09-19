import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import 'antd/dist/antd.css';

import { AuthContext } from "./context/auth";
import PrivateRoute from './PrivateRoute';
import API from "./utils/API";
import BaseContainer from './containers/BaseContainer';
import AuthContainer from './containers/AuthContainer';

function App() {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));

  API.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;

  const handleTokenChange = (token) => {
    localStorage.setItem("accessToken", token);
    setAccessToken(token);
  }

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken: handleTokenChange}}>
      <div id="container">
        <Router>
          <Switch>
            <Route path="/(auth)" component={AuthContainer}/>
            <PrivateRoute component={BaseContainer} />
          </Switch>
        </Router>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
