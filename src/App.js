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
import Todos from './Components/Todos';
import LoginNew from './Components/LoginNew';
import KAI from './Components/KAI';
import ResetPassword from './Components/ResetPassword';
// import { browserHistory, Router, Route  } from 'react-router';
const { default: jwt_decode } = require("jwt-decode");

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  useEffect(()=>{

  },[]);

  return (
    <>
        <Header></Header>
        <Routes >
          
          <Route path='/login' element={ !token ? < Login /> : <Navigate to = "/" />} />
          <Route path='/signup' element={ !token ? < Signup /> : <Navigate to = "/" />} />
          <Route path='/resetpassword' element={!token ? < ResetPassword /> : <Navigate to="/"/>} />

          <Route path='/home' element={token ? < Home /> : <Navigate to="/login"/>} />
          <Route path='' element={token ? < Home /> : <Navigate to="/login"/>} />
          <Route path='/bookings' element={token ? < BookingMain /> : <Navigate to="/login"/>} />
          <Route path='/bookings/new' element={token ? < NewBooking /> : <Navigate to="/login"/>} />
          <Route path='/food' element={token ? < FoodMain /> : <Navigate to="/login"/>} />
          <Route path='/shopping' element={token ? < ShoppingMain /> : <Navigate to="/login"/>} />
          <Route path='/settings' element={token ? < Settings /> : <Navigate to="/login"/>} />
          {/* <Route path='/kai' element={token ? < KAI /> : <Navigate to="/login"/>} /> */}
          {/* <Route path='/todos' element={token ? < Todos /> : <Navigate to="/login"/>} /> */}
        </Routes >
        <KAI></KAI>
        <></>
    </>
  );
}

export default App;
