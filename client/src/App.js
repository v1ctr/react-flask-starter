import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import 'antd/dist/antd.css';

import PrivateRoute from './PrivateRoute';
import BaseContainer from './containers/BaseContainer';
import AuthContainer from './containers/AuthContainer';
import { useAuth } from "./context/auth";
import API from "./utils/API";


function App() {

  const { refreshAccessToken } = useAuth();

  // Automatically refresh if accessToken has expired
  API.interceptors.response.use((response) => {
    return response
  }, async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const accessToken = await refreshAccessToken();
        if (accessToken) {
          originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
          return API(originalRequest);
        }
      } catch (err) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  });

/*
  // Add accessToken to every request
  API.interceptors.request.use(function (config) {
    // Do something before request is sent
    console.log(config, "hh");
    config.headers['Authorization'] = 'Bearer ' + "hh";
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });
  */

  return (
    <Router>
        <Switch>
          <Route path="/(auth)" component={AuthContainer} />
          <PrivateRoute component={BaseContainer} />
        </Switch>
      </Router>
  );
}

export default App;
