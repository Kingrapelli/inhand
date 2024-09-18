import '../App.css';
import logo from '../logo.svg';
import React from 'react';
import { createContext, useEffect, useState } from 'react';
import Feed from './Feed';

const UserContext = createContext();

function Home(){

  useEffect(()=>{
  },[]);

  return (
    <>
      <Feed />
    </>
  )
}

export default Home;