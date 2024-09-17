import '../App.css';
import logo from '../logo.svg';
import React from 'react';
import { createContext, useEffect, useState } from 'react';

const UserContext = createContext();

function Home(){

  const [username, setUserName] = useState("Naveen");

  useEffect(()=>{
    setTimeout(() => {
      setUserName("Naveen Kumar Rapelli");
    }, 2000);
  },[]);

  return (
    <>
      {username}
      <UserContext.Provider value={username}>
      </UserContext.Provider>
    </>
  )
}

export default Home;