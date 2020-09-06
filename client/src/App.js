import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';

import { AuthContext } from "./context/auth";
import PrivateRoute from './PrivateRoute';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import User from './components/User';

function App() {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));

  const handleTokenChange = (token) => {
    localStorage.setItem("accessToken", token);
    setAccessToken(token);
  }

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken: handleTokenChange}}>
      <CssBaseline />
      <Router>
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/signin" component={SignIn} />
        <PrivateRoute exact path="/me" component={User} />
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
