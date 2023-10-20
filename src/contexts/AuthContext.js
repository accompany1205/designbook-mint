// authContext.js
import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
// import { useNavigate } from "react-router-dom"

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const axiosInstance = axios.create({
  baseURL,
  timeout: 300000,
})

const AuthContext = createContext();

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (window.localStorage.getItem('isLoggedIn') && window.localStorage.getItem('user')) {
      setIsLoggedIn(() => true);
      setUser(JSON.parse(window.localStorage.getItem('user')));
    }
    if (window.localStorage.getItem('apiToken')) {
      axiosInstance.interceptors.request.use(
        function (config) {
          // Add a API key from session
          config.headers["X-Api-Key"] = window.localStorage.getItem('apiToken');
          config.headers["Content-Type"] = "application/json";
          return config;
        },
        function (error) {
          return Promise.reject(error);
        }
      );
    }
  }, [])

  const login = async (email, key) => {
    try {
      console.log({ email, key });
      const res = await axiosInstance.post('/users/partner/login', {
        email,
        key
      });
      if (res && res.data && res.data.success) {
        console.log(res.data);
        setIsLoggedIn(() => true);
        setUser(()=> res.data.user);
        window.localStorage.setItem('user', JSON.stringify(res.data.user));
        window.localStorage.setItem('isLoggedIn', true)
        window.localStorage.setItem('token', res.data.token)
        window.localStorage.setItem('apiToken', res.data.user.apiToken)
        axiosInstance.interceptors.request.use(
          function (config) {
            // Add a API key from session
            config.headers["X-Api-Key"] = res.data.user.apiToken;
            config.headers["Content-Type"] = "application/json";
            return config;
          },
          function (error) {
            return Promise.reject(error);
          }
        );
        console.log(isLoggedIn);
        return true;
      }
      return false;
    } catch (e) {
      console.log(2);
      return false;
    }

  };


  const logout = () => {
    setIsLoggedIn(() => false);
    window.localStorage.removeItem('isLoggedIn');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('apiToken');
    window.localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const authContextValue = {
    isLoggedIn,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
