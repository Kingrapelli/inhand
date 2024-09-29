import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


function LoginNew(){
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();
    // useEffect(()=>{

    // })

    const handleSubmit = async ()=>{
        let request = {'username' : username,'password' : password};
        console.log(request);
        const req = await fetch(`http://localhost:4000/login?username=${username}&password=${password}`,{
            method: 'POST',
            headers : {
                'Contect-Type' : 'application/json'
            },
        })
        const res = await req.json();
        if(res.status){
            localStorage.setItem('token',res.token);
            localStorage.setItem('user',JSON.stringify(res.user));
            navigate('/home');
        }else{
            console.log(res.message);
        }
    }

    return (
        <>
            <div>
                <form>
                    <input
                        type='text'
                        name='username'
                        id='username'
                        placeholder='Enter Username'
                        onChange={(e)=> setUserName(e.target.value)}
                        required
                    ></input>
                    <input
                        type='password'
                        name='password'
                        id='password'
                        placeholder='Enter Password'
                        onChange={(e)=> setPassword(e.target.value)}
                        required>
                    </input>
                    <button
                        type='button'
                        onClick={handleSubmit}
                    >Signin</button>
                </form>
            </div>
        </>
    )
}

export default LoginNew;