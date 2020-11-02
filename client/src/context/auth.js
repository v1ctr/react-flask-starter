// Inspired by https://kentcdodds.com/blog/authentication-in-react-applications
import React, { useState } from 'react'
import axios from "axios";
import API from "../utils/API";

const AuthContext = React.createContext()
function AuthProvider(props) {
  // code for pre-loading the user's information if we have their token in
  // localStorage goes here
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));

  //const [user, setUser] = useState({});

  // Add accessToken to every request
  API.interceptors.request.use(function (config) {
    // Do something before request is sent
    config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('accessToken');
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  // Automatically refresh if accessToken has expired
  API.interceptors.response.use((response) => {
    return response
  }, async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        let result = await axios.post('/api/auth/refresh', {
          //...data
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("refreshToken")}`
          }
        });
        if (result.status === 200) {
          handleAccessTokenChange(result.data.access_token);
          originalRequest.headers['Authorization'] = 'Bearer ' + result.data.access_token;
          return API(originalRequest);
        }
      } catch (err) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  });
  
  // 🚨 this is the important bit.
  // Normally your provider components render the context provider with a value.
  // But we post-pone rendering any of the children until after we've determined
  // whether or not we have a user token and if we do, then we render a spinner
  // while we go retrieve that user's information.
  /*if (isLoading) {
    return <FullPageSpinner />
  }
  */

 const handleAccessTokenChange = (token) => {
  localStorage.setItem("accessToken", token);
  setAccessToken(token);
  API.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
}

const handleRefreshTokenChange = (token) => {
  localStorage.setItem("refreshToken", token);
}

 // make a login request
  async function signIn(values) {
    try {
      let result = await API.post('/auth/signin', values);
      if (result.status === 200) {
        handleAccessTokenChange(result.data.access_token);
        handleRefreshTokenChange(result.data.refresh_token);
      } else {
        console.log("failed");
      }
    } catch (error) {
      console.log("error");
    }
  }

  // register the user
  async function signUp(values) {
    try {
      let result = await API.post('/auth/signup', values);
      if (result.status === 201) {
        handleAccessTokenChange(result.data.access_token);
        handleRefreshTokenChange(result.data.refresh_token);
      } else {
        console.log("failed");
      }
    } catch (error) {
      console.log("error");
    }
  }

  // clear the token in localStorage and the user data
  const signOut = () => {
    handleAccessTokenChange('');
    handleRefreshTokenChange('');
  }
  
  // note, I'm not bothering to optimize this `value` with React.useMemo here
  // because this is the top-most component rendered in our app and it will very
  // rarely re-render/cause a performance problem.
  return (
    <AuthContext.Provider value={{accessToken, signIn, signOut, signUp}} {...props} />
  )
}
const useAuth = () => React.useContext(AuthContext)
export {AuthProvider, useAuth}
// the UserProvider in user-context.js is basically:
// const UserProvider = props => (
//   <UserContext.Provider value={useAuth().data.user} {...props} />
// )
// and the useUser hook is basically this:
// const useUser = () => React.useContext(UserContext)