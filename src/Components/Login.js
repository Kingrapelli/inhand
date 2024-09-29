import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Message } from './Enums/ErrorMessages';
import { login } from '../Services/auth';

function Login() {
  const [email,setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // if(localStorage.getItem('token'))
    //   navigate('/home');
  })

  const handleSubmit = async () => {
    if(email == '' || password == ''){
      alert("Fields are mandatory");
      return 
    }
    const request = await fetch(`http://localhost:5000/users?email=${email}&password=${password}`);
    const responce = await request.json();
    if(responce.length >0){
      let token = Math.random().toString(36).slice(2);
      localStorage.setItem('token',token);
      localStorage.setItem('user',JSON.stringify(responce[0]));
      navigate('/home');
      console.log(Message.Logged_In_SuccessFully);
    }
    else
      alert(Message.Error_While_Logging_IN);
  }

  const handleLogin = async () => {
    // try {
    //   const response = await login(username, password);
    //   setToken(response.data.token);
    //   localStorage.setItem('token',response.data.token);
    //   localStorage.setItem('user',JSON.stringify(response.data.user));
    //   alert('Login successful');
    //   navigate('/home');
    // } catch (error) {
    //   console.error('Login error', error);
    // }
  };

  const navigateToSignup = () => {
    navigate('/signup')
  }

  return (
    <>
      <div id="logindiv">
        <form >
          <img src='loginuser.png' alt='' height={150} width={150}></img>
          <input 
            type='email'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            required>
          </input>
          <input
            type='password'
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            required>
          </input>
          <button id='signin' type='button' onClick={handleSubmit}>SignIn</button>
          <p>Don't have an account? <a onClick={navigateToSignup} style={{cursor:'pointer'}}>SignUp</a></p>
        </form>
      </div>
    </>
  )
}

export default Login;