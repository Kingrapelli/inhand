import React from 'react';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup(){
    const navigate = useNavigate();
    let image ;
    const [user, setUser] = useState({
        name : '',
        email : '',
        password : '',
        city : '',
        path : ''
    })

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            image = URL.createObjectURL(event.target.files[0]);
            console.log(image);
        }
    }

    useEffect(()=>{
        if(localStorage.getItem('token'))
            navigate('/dashboard');
    })

    const handleChane = async (e) => {
        const {name, value} = e.target;
        setUser((prevuser)=>({
            ... prevuser,
            [name]: value,
            path: image
        }))
    }

    const handleSubmit = async () => {
        if(user.name == '' || user.email == '' || user.password == '')
            return
        const validatinguser = await validateExistingUser();
        if(validatinguser){
            alert("Email already exists")
            return 
        }
        const res = fetch('http://localhost:5000/users', {
            method: 'POST',
            headers: {
                "Content-Type" : 'application/json'
            },
            body: JSON.stringify(user)
        }).then(()=>{
            alert("User got created")
            navigate('/login');
        }).catch(error=>{
            console.log("Error while creating user.",error);
        });
    }

    function NavigateToLogin () {
        navigate('/login');
    }

    const validateExistingUser = async () => {
        const request = await fetch(`http://localhost:5000/users`,{
            method: 'GET',
            headers: {
                "Content-Type" : 'application/json'
            }
        });
        const res = await request.json();
        if(res.length){
            const userpresence = res.find(data => data.email === user.email);
            return userpresence ? true : false;
        }else{
            return false;
        }
    }

    return (
        <>
            <div id='logindiv'>
                <form >
                    <img src='adduser.jpg' alt='' height={120} width={120}></img>
                    <input
                        type='text'
                        name='name'
                        value={user.name}
                        placeholder='Full Name'
                        onChange={handleChane}
                        required>
                    </input>
                    <input
                        type='email'
                        name='email'
                        value={user.email}
                        placeholder='Email'
                        onChange={handleChane}
                        required>
                    </input>
                    <input
                        type='password'
                        name='password'
                        value={user.password}
                        placeholder='Password'
                        onChange={handleChane}
                        required>
                    </input>
                    {/* <input type="file" name='path' onChange={onImageChange} className="filetype" required /> */}
                    <button id='signin' type='button' onClick={handleSubmit}>SignUp</button>
                    <p>Already have an account? <a onClick={NavigateToLogin} style={{cursor:'pointer'}}>Login</a></p>
                </form>
            </div>
        </>
    )
}

export default Signup;