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
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken"));

  API.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
  API.interceptors.response.use((response) => {
    return response
  }, async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        let result = await API.post('/auth/refresh', {
          //...data
        }, {
          headers: {
            'Authorization': `Bearer ${refreshToken}` 
          }
        });
        handleAccessTokenChange(result.data.access_token);
      } catch (error) {
        console.log("error");
      }       
      API.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
      return API(originalRequest);
    }
    return Promise.reject(error);
  });

  const handleAccessTokenChange = (token) => {
    localStorage.setItem("accessToken", token);
    setAccessToken(token);
  }

  const handleRefreshTokenChange = (token) => {
    localStorage.setItem("refreshToken", token);
    setRefreshToken(token);
  }

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken: handleAccessTokenChange, 
        refreshToken, setRefreshToken: handleRefreshTokenChange}}>
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
