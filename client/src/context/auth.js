// Inspired by https://kentcdodds.com/blog/authentication-in-react-applications
import React, { useState } from 'react'
import axios from "axios";
import Cookies from 'js-cookie';
import API from "../utils/API";

const AuthContext = React.createContext()
function AuthProvider(props) {
  // code for pre-loading the user's information if we have their token in
  // localStorage goes here
  const [accessToken, setAccessToken] = useState("");
  //const [user, setUser] = useState({});
  
  // 🚨 this is the important bit.
  // Normally your provider components render the context provider with a value.
  // But we post-pone rendering any of the children until after we've determined
  // whether or not we have a user token and if we do, then we render a spinner
  // while we go retrieve that user's information.
  /*if (isLoading) {
    return <FullPageSpinner />
  }
  */

  const syncSignOut = (event) => {
    if (event.key === 'signout') {
      handleAccessTokenChange('');
    }
  }

  window.addEventListener('storage', syncSignOut);

  // silent refresh
  if (!accessToken) {
    refreshAccessToken();
  }

  const handleAccessTokenChange = (token) => {
    API.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    setAccessToken(token);
  }

 // make a login request
  const signIn = (values) => {
    return API.post('/auth/signin', values).then((result) => {
      if (result.status === 200) {
        handleAccessTokenChange(result.data.access_token);
      }
    });
  }

  // register the user
  async function signUp(values) {
    try {
      let result = await API.post('/auth/signup', values);
      if (result.status === 201) {
        handleAccessTokenChange(result.data.access_token);
      } else {
        console.log("failed");
      }
    } catch (error) {
      console.log("error");
    }
  }

    // refresh access token
    async function refreshAccessToken() {
      let csrfRefreshToken = Cookies.get('csrf_refresh_token');
      if (csrfRefreshToken) {
        try {
          let result = await axios.post('/api/auth/refresh', {}, {
            headers: {
              'X-CSRF-TOKEN': csrfRefreshToken
            }
          });
          if (result.status === 200) {
            handleAccessTokenChange(result.data.access_token);
            return Promise.resolve(result.data.access_token);
          } else {
            console.log("failed");
          }
        } catch (error) {
          console.log("error");
        }
      } else {
        return false;
      }
    }

  // clear the token and and force signout
  async function signOut() {
    let csrfRefreshToken = Cookies.get('csrf_refresh_token');
    if (csrfRefreshToken) {
      await axios.delete('/api/auth/refresh', {
        headers: {
          'X-CSRF-TOKEN': csrfRefreshToken
        }
      });
    }
    handleAccessTokenChange('');
    // Sign out from all windows and tabs
    window.localStorage.setItem('signout', Date.now())
  }
  
  // note, I'm not bothering to optimize this `value` with React.useMemo here
  // because this is the top-most component rendered in our app and it will very
  // rarely re-render/cause a performance problem.
  return (
    <AuthContext.Provider value={{accessToken, refreshAccessToken, signIn, signOut, signUp}} {...props} />
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