import logo from './logo.svg';
import './App.css';
import { Routes, Route, useNavigate  } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import React from 'react';
import Home from './Components/Home';
import Login from './Components/Login';
import Signup from './Components/Signup';
import { createContext, useEffect, useState } from 'react';
import Dashboard from './Components/Dashboard';
import BookingMain from './Components/Booking/BookingMain';
import NewBooking from './Components/Booking/NewBooking';
// import { browserHistory, Router, Route  } from 'react-router';
const { default: jwt_decode } = require("jwt-decode");

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState();

  useEffect(()=>{
    if(!localStorage.getItem('token')){
      const token = localStorage.getItem('token');
      if(isTokenExpired(token)){
        localStorage.removeItem('token');
        navigate('/login');
      }else{
        setUser(JSON.parse(localStorage.getItem('user')));
      }
    }else{
      navigate('/login');
    }
  },[]);

  const isTokenExpired = (token) => {
    if(!token) return false;
    try{
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    }catch(error){
      console.log("Error while decoding token",error);
      return false;
    }
  }

  return (
    <>
        <Routes >
          <Route path='/' element={< Home />} />
          <Route path='/login' element={ < Login />} />
          <Route path='/signup' element={ < Signup />} />
          <Route path='/dashboard' element={< Dashboard />} />
          <Route path='/booking' element={< BookingMain />} />
          <Route path='/booking/new' element={< NewBooking />} />
        </Routes >
    </>
  );
}

export default App;
