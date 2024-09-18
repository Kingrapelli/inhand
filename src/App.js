import logo from './logo.svg';
import './App.css';
import { Routes, Route, useNavigate, Navigate  } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import React from 'react';
import Home from './Components/Home';
import Login from './Components/Login';
import Signup from './Components/Signup';
import { createContext, useEffect, useState } from 'react';
import Header from './Components/Header';
import BookingMain from './Components/Booking/BookingMain';
import NewBooking from './Components/Booking/NewBooking';
import FoodMain from './Components/Food/FoodMain';
import ShoppingMain from './Components/Shopping/ShoppingMain';
import Settings from './Components/Settings';
// import { browserHistory, Router, Route  } from 'react-router';
const { default: jwt_decode } = require("jwt-decode");

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  useEffect(()=>{
    // console.log(token, localStorage.getItem('token'));
    // if(!localStorage.getItem('token')){
    //   const token = localStorage.getItem('token');
    //   if(isTokenExpired(token)){
    //     localStorage.removeItem('token');
    //     navigate('/login');
    //   }else{
    //     setUser(JSON.parse(localStorage.getItem('user')));
    //   }
    // }else{
    //   navigate('/login');
    // }
  },[]);

  // const isTokenExpired = (token) => {
  //   if(!token) return false;
  //   try{
  //     const decodedToken = jwt_decode(token);
  //     const currentTime = Date.now() / 1000;
  //     return decodedToken.exp < currentTime;
  //   }catch(error){
  //     console.log("Error while decoding token",error);
  //     return false;
  //   }
  // }

  return (
    <>
        <Header></Header>
        <Routes >
          <Route path='/login' element={ !token ? < Login /> : <Navigate to = "/" />} />
          <Route path='/signup' element={ !token ? < Signup /> : <Navigate to = "/" />} />
          <Route path='/home' element={token ? < Home /> : <Navigate to="/login"/>} />
          <Route path='' element={token ? < Home /> : <Navigate to="/login"/>} />
          <Route path='/bookings' element={token ? < BookingMain /> : <Navigate to="/login"/>} />
          <Route path='/bookings/new' element={token ? < NewBooking /> : <Navigate to="/login"/>} />
          <Route path='/food' element={token ? < FoodMain /> : <Navigate to="/login"/>} />
          <Route path='/shopping' element={token ? < ShoppingMain /> : <Navigate to="/login"/>} />
          <Route path='/settings' element={token ? < Settings /> : <Navigate to="/login"/>} />
        </Routes >
        <></>
    </>
  );
}

export default App;
